from typing import Optional, List, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import CourseTeacher


class CourseTeachersRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_course_id(self, course_id: int) -> Sequence[CourseTeacher]:
        query = (
            select(CourseTeacher)
            .filter_by(course_id=course_id)
        )
        results = await self.db.execute(query)
        return results.scalars().all()

    async def get_by_teacher_id(self, teacher_id: int) -> Sequence[CourseTeacher]:
        query = (
            select(CourseTeacher)
            .filter_by(teacher_id=teacher_id)
        )
        results = await self.db.execute(query)
        return results.scalars().all()

    async def get_by_id(self, course_teacher_id: int) -> Optional[CourseTeacher]:
        query = (
            select(CourseTeacher)
            .filter_by(id=course_teacher_id)
        )
        results = await self.db.execute(query)
        return results.scalars().first()

    async def create_list(self, course_teachers: List[CourseTeacher]) -> List[CourseTeacher]:
        self.db.add_all(course_teachers)
        await self.db.commit()

        for course_teacher in course_teachers:
            await self.db.refresh(course_teacher)

        return course_teachers

    async def delete_list(self, course_teachers: List[CourseTeacher] | Sequence[CourseTeacher]) -> List[CourseTeacher]:
        for course_teacher in course_teachers:
            await self.db.delete(course_teacher)

        await self.db.commit()
        return course_teachers
