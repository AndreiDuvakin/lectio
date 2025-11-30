from typing import Dict

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.gradebook import GradeBookRead, StudentProgress, LessonInfo, TaskInfo
from app.domain.models import Course, Lesson, Task, User, Enrollment, UserCheckLessons, Solution


class GradeBookService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_gradebook_by_course_id(self, course_id: int) -> GradeBookRead:
        # 1. Курс
        course = await self.db.scalar(select(Course).filter_by(id=course_id))
        if not course:
            raise ValueError("Курс не найден")

        # 2. Лекции
        lessons = (await self.db.execute(
            select(Lesson).filter_by(course_id=course_id).order_by(Lesson.number)
        )).scalars().all()

        # 3. Задания
        tasks = (await self.db.execute(
            select(Task).filter_by(course_id=course_id).order_by(Task.number)
        )).scalars().all()

        # 4. Студенты
        students = (await self.db.execute(
            select(User)
            .join(Enrollment, User.id == Enrollment.student_id)
            .filter(Enrollment.course_id == course_id)
            .order_by(User.last_name, User.first_name)
        )).scalars().all()

        student_progress_map: dict[int, StudentProgress] = {}

        if students:
            student_ids = [s.id for s in students]

            # --- Прочитанные лекции ---
            read_result = await self.db.execute(
                select(UserCheckLessons.user_id, UserCheckLessons.lesson_id)
                .filter(UserCheckLessons.user_id.in_(student_ids))
            )
            read_map: dict[int, set[int]] = {}
            for user_id, lesson_id in read_result:
                read_map.setdefault(user_id, set()).add(lesson_id)

            # --- МАКСИМАЛЬНЫЕ ОЦЕНКИ (ТОЛЬКО ИЗ ОЦЕНЕННЫХ РЕШЕНИЙ!) ---
            grades_result = await self.db.execute(
                select(
                    Solution.student_id,
                    Solution.task_id,
                    func.max(Solution.assessment)
                )
                .where(
                    Solution.student_id.in_(student_ids),
                    Solution.assessment.is_not(None)  # ← Вот это главное!
                )
                .group_by(Solution.student_id, Solution.task_id)
            )

            grade_map: dict[tuple[int, int], int] = {
                (student_id, task_id): best_grade
                for student_id, task_id, best_grade in grades_result
            }

            # --- Собираем прогресс ---
            for student in students:
                student_progress_map[student.id] = StudentProgress(
                    student_id=student.id,
                    first_name=student.first_name,
                    last_name=student.last_name,
                    patronymic=student.patronymic or "",
                    read_lesson_ids=sorted(read_map.get(student.id, set())),
                    task_grades={
                        task.id: grade_map.get((student.id, task.id))
                        for task in tasks
                    }
                )

        return GradeBookRead(
            course_id=course_id,
            course_title=course.title,
            lessons=[
                LessonInfo(id=l.id, title=l.title, number=l.number)
                for l in lessons
            ],
            tasks=[
                TaskInfo(id=t.id, title=t.title, number=t.number)
                for t in tasks
            ],
            students=list(student_progress_map.values())
        )