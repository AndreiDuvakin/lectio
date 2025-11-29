from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import TaskFile


class TaskFilesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, file_id: int) -> Optional[TaskFile]:
        query = (
            select(TaskFile)
            .filter_by(id=file_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_task_id(self, task_id: int) -> Optional[TaskFile]:
        query = (
            select(TaskFile)
            .filter_by(task_id=task_id)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, task_file: TaskFile) -> TaskFile:
        self.db.add(task_file)
        await self.db.commit()
        await self.db.refresh(task_file)
        return task_file

    async def delete(self, task_file: TaskFile) -> TaskFile:
        await self.db.delete(task_file)
        await self.db.commit()
        return task_file
