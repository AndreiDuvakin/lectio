from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import SolutionComment


class SolutionCommentsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, comment_id: int) -> Optional[SolutionComment]:
        query = (
            select(SolutionComment)
            .filter_by(id=comment_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_solution_id(self, solution_id: int) -> Optional[List[SolutionComment]]:
        query = (
            select(SolutionComment)
            .filter_by(solution_id=solution_id)
            .order_by(SolutionComment.created_at)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, comment: SolutionComment) -> SolutionComment:
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        return comment

    async def delete(self, comment: SolutionComment) -> SolutionComment:
        await self.db.delete(comment)
        await self.db.commit()
        return comment
