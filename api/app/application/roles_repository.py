from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.roles import Role


class RolesRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, role_id: int) -> Optional[Role]:
        query = (
            select(Role)
            .filter_by(role_id=role_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_title(self, title: str) -> Optional[Role]:
        query = (
            select(Role)
            .filter_by(title=title)
        )
        result = await self.db.execute(query)
        return result.scalars().first()
