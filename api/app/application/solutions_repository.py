from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.models import Solution


class SolutionsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, solution_id: int) -> Optional[Solution]:
        query = (
            select(Solution)
            .filter_by(id=solution_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_task_id(self, task_id: int) -> Optional[List[Solution]]:
        query = (
            select(Solution)
            .filter_by(task_id=task_id)
            .options(
                selectinload(Solution.files),
                selectinload(Solution.solution_comments),
            )
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_task_id_and_student_id(self, task_id: int, student_id: int) -> Optional[List[Solution]]:
        query = (
            select(Solution)
            .filter_by(task_id=task_id, student_id=student_id)
            .options(
                selectinload(Solution.files),
                selectinload(Solution.solution_comments),
            )
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, solution: Solution) -> Solution:
        self.db.add(solution)
        await self.db.commit()
        await self.db.refresh(solution)
        return solution

    async def update(self, solution: Solution) -> Solution:
        await self.db.merge(solution)
        await self.db.commit()
        return solution

    async def delete(self, solution: Solution) -> Solution:
        await self.db.delete(solution)
        await self.db.commit()
        return solution
