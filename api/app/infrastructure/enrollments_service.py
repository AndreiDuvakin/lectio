from typing import Optional, List
from fastapi import HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.enrollments_repository import EnrollmentsRepository
from app.application.courses_repository import CoursesRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.enrollments import EnrollmentRead, EnrollmentCreate
from app.domain.models import Enrollment


class EnrollmentsService:
    def __init__(self, db: AsyncSession):
        self.enrollments_repository = EnrollmentsRepository(db)
        self.courses_repository = CoursesRepository(db)
        self.users_repository = UsersRepository(db)

    async def get_course_students_by_course_id(self, course_id: int) -> Optional[List[EnrollmentRead]]:
        course = await self.courses_repository.get_by_id(course_id)

        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Курс с таким ID не найден')

        enrollments = await self.enrollments_repository.get_by_course_id(course.id)

        response = []
        for enrollment in enrollments:
            response.append(
                EnrollmentRead.model_validate(enrollment)
            )

        return response

    async def replace_course_students_list(
            self, enrollments: List[EnrollmentCreate], course_id: int
    ) -> Optional[List[EnrollmentRead]]:
        course = await self.courses_repository.get_by_id(course_id)

        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Курс с таким ID не найден')

        old_enrollments = await self.enrollments_repository.get_by_course_id(course.id)
        await self.enrollments_repository.delete_list(old_enrollments)

        enrollments_models = []
        for enrollment in enrollments:
            student = await self.users_repository.get_by_id(enrollment.student_id)
            if student is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Пользователь с таким ID не найден')

            enrollments_models.append(Enrollment(
                course_id=course_id,
                student_id=enrollment.student_id,
                enrollment_date=enrollment.enrollment_date,
            ))

        enrollments_models = await self.enrollments_repository.create_list(enrollments_models)

        response = []
        for enrollment in enrollments_models:
            response.append(
                EnrollmentRead.model_validate(enrollment)
            )

        return response
