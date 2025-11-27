from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.users_repository import UsersRepository
from app.domain.entities.users import UserRead


class UsersService:
    def __init__(self, db: AsyncSession):
        self.users_repository = UsersRepository(db)

    async def get_by_id(self, user_id: int) -> UserRead:
        user = await self.users_repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пользователь не найден',
            )

        return UserRead.model_validate(user)
