from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.users_repository import UsersRepository
from app.domain.entities.users import UserRead, UserUpdate, PasswordChangeRequest
from app.domain.models import User
from app.infrastructure.register_service import RegisterService
from app.settings import Settings


class UsersService:
    def __init__(self, db: AsyncSession):
        self.users_repository = UsersRepository(db)
        self.settings = Settings()

    async def get_all(self) -> List[UserRead]:
        users = await self.users_repository.get_all()
        response = []

        for user in users:
            response.append(UserRead.model_validate(user))

        return response

    async def get_by_id(self, user_id: int) -> UserRead:
        user = await self.users_repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пользователь не найден',
            )

        return UserRead.model_validate(user)

    async def update(self, user_id: int, user: UserUpdate, current_user: User) -> Optional[UserRead]:
        user_model = await self.users_repository.get_by_id(user_id)
        if not user_model:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пользователь не найден',
            )

        if current_user.id != user_model.id and not current_user.role.title != self.settings.root_role_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='Доступ запрещен',
            )

        user_model.first_name = user.first_name
        user_model.last_name = user.last_name
        user_model.patronymic = user.patronymic
        user_model.email = user.email
        user_model.birthdate = user.birthdate

        user_model = await self.users_repository.update(user_model)

        return UserRead.model_validate(user_model)

    async def change_password(
            self, user_id: int, password_data: PasswordChangeRequest, current_user: User
    ) -> Optional[UserRead]:
        user_model = await self.users_repository.get_by_id(user_id)
        if not user_model:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пользователь не найден',
            )

        if current_user.id != user_model.id and not current_user.role.title != self.settings.root_role_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='Доступ запрещен',
            )

        if password_data.password != password_data.repeat_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пароли не совпадают',
            )

        if not RegisterService.is_strong_password(password_data.repeat_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пароль слишком слабый. Пароль должен содержать не менее 8 символов, включая хотя бы одну букву и одну цифру и один специальный символ.'
            )

        user_model.set_password(password_data.password)

        user_model = await self.users_repository.update(user_model)

        return UserRead.model_validate(user_model)
