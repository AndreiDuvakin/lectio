from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Task


class TasksRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_all_by_course(self, course_id: int) -> List[Task]:
        query = (
            select(Task)
            .filter_by(course_id=course_id)
            .order_by(Task.number)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, task_id: int) -> Optional[Task]:
        query = (
            select(Task)
            .filter_by(id=task_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create(self, task: Task) -> Task:
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def update(self, task: Task) -> Task:
        await self.db.merge(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def delete(self, task: Task) -> Task:
        await self.db.delete(task)
        await self.db.commit()
        return task
