from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Lesson


class LessonsRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_all_by_course(self, course_id: int) -> List[Lesson]:
        query = (
            select(Lesson)
            .filter_by(course_id=course_id)
            .order_by(Lesson.number)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, lesson_id: int) -> Optional[Lesson]:
        query = (
            select(Lesson)
            .filter_by(id=lesson_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create(self, lesson: Lesson) -> Lesson:
        self.db.add(lesson)
        await self.db.commit()
        await self.db.refresh(lesson)
        return lesson

    async def update(self, lesson: Lesson) -> Lesson:
        await self.db.merge(lesson)
        await self.db.commit()
        await self.db.refresh(lesson)
        return lesson

    async def delete(self, lesson: Lesson) -> Lesson:
        await self.db.delete(lesson)
        await self.db.commit()
        return lesson
