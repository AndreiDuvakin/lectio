from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.statuses import Status


class StatusesRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, status_id: int) -> Optional[Status]:
        query = (
            select(Status)
            .filter_by(id=status_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_title(self, title: str) -> Optional[Status]:
        query = (
            select(Status)
            .filter_by(title=title)
        )
        result = await self.db.execute(query)
        return result.scalars().first()
