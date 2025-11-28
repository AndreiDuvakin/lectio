from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import LessonFile


class LessonFilesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, file_id: int) -> Optional[LessonFile]:
        query = (
            select(LessonFile)
            .filter_by(id=file_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_lesson_id(self, lesson_id: int) -> Optional[LessonFile]:
        query = (
            select(LessonFile)
            .filter_by(lesson_id=lesson_id)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, lesson_file: LessonFile) -> LessonFile:
        self.db.add(lesson_file)
        await self.db.commit()
        await self.db.refresh(lesson_file)
        return lesson_file

    async def delete(self, lesson_file: LessonFile) -> LessonFile:
        await self.db.delete(lesson_file)
        await self.db.commit()
        return lesson_file
