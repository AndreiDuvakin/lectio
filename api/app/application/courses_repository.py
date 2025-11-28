from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.models import Course


class CoursesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Course]:
        query = (
            select(Course)
            .options(
                selectinload(Course.teachers),
                selectinload(Course.enrollments)
            )
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, course_id: int) -> Optional[Course]:
        query = (
            select(Course)
            .options(
                selectinload(Course.teachers),
                selectinload(Course.enrollments)
            )
            .filter_by(id=course_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create(self, course: Course) -> Course:
        self.db.add(course)
        await self.db.commit()
        await self.db.refresh(course)
        return course

    async def update(self, course: Course) -> Course:
        await self.db.merge(course)
        await self.db.commit()
        return course

    async def delete(self, course: Course) -> Course:
        await self.db.delete(course)
        await self.db.commit()
        return course
