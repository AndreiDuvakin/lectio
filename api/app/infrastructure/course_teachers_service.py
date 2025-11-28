from typing import Optional, List
from fastapi import HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.course_teachers_repository import CourseTeachersRepository
from app.application.courses_repository import CoursesRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.course_teachers import CourseTeacherRead, CourseTeacherCreate
from app.domain.models import CourseTeacher


class CourseTeachersService:
    def __init__(self, db: AsyncSession):
        self.course_teachers_repository = CourseTeachersRepository(db)
        self.courses_repository = CoursesRepository(db)
        self.users_repository = UsersRepository(db)

    async def get_course_teachers_by_course_id(self, course_id: int) -> Optional[List[CourseTeacherRead]]:
        course = await self.courses_repository.get_by_id(course_id)

        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Курс с таким ID не найден')

        course_teachers = await self.course_teachers_repository.get_by_course_id(course.id)

        response = []
        for course_teacher in course_teachers:
            response.append(
                CourseTeacherRead.model_validate(course_teacher)
            )

        return response

    async def replace_course_teachers_list(
            self, course_teachers: List[CourseTeacherCreate], course_id: int
    ) -> Optional[List[CourseTeacherRead]]:
        course = await self.courses_repository.get_by_id(course_id)

        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Курс с таким ID не найден')

        old_course_teachers = await self.course_teachers_repository.get_by_course_id(course.id)
        await self.course_teachers_repository.delete_list(old_course_teachers)

        course_teachers_models = []
        for course_teacher in course_teachers:
            teacher = await self.users_repository.get_by_id(course_teacher.teacher_id)
            if teacher is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Пользователь с таким ID не найден')

            course_teachers_models.append(CourseTeacher(
                course_id=course_id,
                teacher_id=course_teacher.teacher_id,
            ))

        course_teachers_models = await self.course_teachers_repository.create_list(course_teachers_models)

        response = []
        for course_teacher in course_teachers_models:
            response.append(
                CourseTeacherRead.model_validate(course_teacher)
            )

        return response
