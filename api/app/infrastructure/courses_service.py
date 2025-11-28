from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.courses_repository import CoursesRepository
from app.domain.entities.courses import CourseRead, CourseCreate
from app.domain.models import Course


class CoursesService:
    def __init__(self, db: AsyncSession):
        self.courses_repository = CoursesRepository(db)

    async def get_all(self) -> List[CourseRead]:
        courses = await self.courses_repository.get_all()
        response = []
        for course in courses:
            response.append(
                CourseRead.model_validate(course)
            )

        return response

    async def create(self, course: CourseCreate) -> Optional[CourseRead]:
        course_model = Course(
            title=course.title,
            description=course.description,
        )

        course_model = await self.courses_repository.create(course_model)

        return CourseRead.model_validate(course_model)

    async def update(self, course_id: int, course: CourseCreate) -> Optional[CourseRead]:
        course_model = await self.courses_repository.get_by_id(course_id)

        if course_model is None:
            raise HTTPException(status_code=404, detail='Курс с таким ID не найден')

        course_model.title = course.title
        course_model.description = course.description

        course_model = await self.courses_repository.update(course_model)

        return CourseRead.model_validate(course_model)
