from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Role
from app.domain.models.users import User


class UsersRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_all(self) -> List[User]:
        query = select(User)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, user_id: int) -> Optional[User]:
        query = (
            select(User)
            .filter_by(id=user_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_login(self, login: str) -> Optional[User]:
        query = (
            select(User)
            .filter_by(login=login)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_role_name(self, role_name: str) -> List[User]:
        query = (
            select(User)
            .join(User.role)
            .filter(Role.title == role_name)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user: User) -> User:
        await self.db.merge(user)
        await self.db.commit()
        return user
