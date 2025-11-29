from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.courses_repository import CoursesRepository
from app.application.lessons_repository import LessonsRepository
from app.application.solutions_repository import SolutionsRepository
from app.application.tasks_repository import TasksRepository
from app.application.user_check_lessons_repository import UserCheckLessonsRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.users import UserCheckLessonRead, UserCheckLessonCreate
from app.domain.models import UserCheckLessons


class UserCheckLessonsService:
    def __init__(self, db: AsyncSession):
        self.user_check_lessons_repository = UserCheckLessonsRepository(db)
        self.users_repository = UsersRepository(db)
        self.lessons_repository = LessonsRepository(db)
        self.courses_repository = CoursesRepository(db)
        self.tasks_repository = TasksRepository(db)
        self.lessons_repository = LessonsRepository(db)
        self.solutions_repository = SolutionsRepository(db)

    async def get_by_course_id_and_user_id(self, course_id: int, user_id: int) -> Optional[List[UserCheckLessonRead]]:
        user = await self.users_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )

        course = await self.courses_repository.get_by_id(course_id)
        if course is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Курс не найден"
            )

        checks = await self.user_check_lessons_repository.get_by_course_id_and_user_id(course_id, user_id)
        response = []
        for check in checks:
            response.append(
                UserCheckLessonRead.model_validate(check)
            )

        return response

    async def create(self, lesson_id: int, user_id: int) -> None:
        user = await self.users_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )

        lesson = await self.lessons_repository.get_by_id(lesson_id)
        if lesson is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Лекция не найдена"
            )

        user_check = await self.user_check_lessons_repository.get_by_user_id_and_lesson_id(
            user_id,
            lesson_id
        )

        if user_check is not None:
            return

        user_check_model = UserCheckLessons(
            lesson_id=lesson_id,
            user_id=user_id,
        )
        user_check_model = await self.user_check_lessons_repository.create(user_check_model)

    async def calculate_user_progress(self, course_id: int, user_id: int) -> float:
        total_lessons = await self.lessons_repository.get_all_by_course(course_id)
        total_tasks = await self.tasks_repository.get_all_by_course(course_id)

        total_content = len(total_lessons) + len(total_tasks)
        if total_content == 0:
            return 100.0

        passed_lessons = await self.user_check_lessons_repository.get_by_course_id_and_user_id(
            course_id=course_id,
            user_id=user_id
        )
        passed_lessons_count = len(passed_lessons)

        completed_tasks = await self.solutions_repository.get_completed_tasks_by_course_and_user(
            course_id=course_id,
            user_id=user_id
        )
        completed_tasks_count = len(completed_tasks)

        completed_total = passed_lessons_count + completed_tasks_count
        progress = (completed_total / total_content) * 100

        return round(progress, 2)