import re
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.roles_repository import RolesRepository
from app.application.statuses_repository import StatusesRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.users import UserCreate, UserRead
from app.domain.models.users import User
from app.settings import Settings


class UsersService:
    def __init__(self, db: AsyncSession):
        self.users_repository = UsersRepository(db)
        self.roles_repository = RolesRepository(db)
        self.statuses_repository = StatusesRepository(db)
        self.settings = Settings()

    async def create_user(self, create_user_entity: UserCreate) -> Optional[UserRead]:
        user = await self.users_repository.get_by_login(create_user_entity.login)
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пользователь с таким логином уже существует',
            )

        if create_user_entity.password != create_user_entity.repeat_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пароли не совпадают',
            )

        if not self.is_strong_password(create_user_entity.repeat_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Пароль слишком слабый. Пароль должен содержать не менее 8 символов, включая хотя бы одну букву и одну цифру и один специальный символ.'
            )

        default_status = await self.statuses_repository.get_by_title(self.settings.default_status)
        if default_status is None:
            raise HTTPException(
                status_code=status.HTTP_424_FAILED_DEPENDENCY,
                detail='Статус по умолчанию не найден',
            )

        user = User(
            first_name=create_user_entity.first_name,
            last_name=create_user_entity.last_name,
            patronymic=create_user_entity.patronymic,
            login=create_user_entity.login,
            email=create_user_entity.email,
            birthdate=create_user_entity.birthdate,
            status_id=default_status.status_id,
        )

        if create_user_entity.role_id is None:
            default_role = await self.roles_repository.get_by_title(self.settings.default_role_name)
            if default_role is None:
                raise HTTPException(
                    status_code=status.HTTP_424_FAILED_DEPENDENCY,
                    detail='Роль по умолчанию не найдена',
                )

            user.role_id = default_role.id

        else:
            role = await self.roles_repository.get_by_id(create_user_entity.role_id)
            if role is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='Роль с таким ID не найдена',
                )

            user.role_id = role.id

        user.set_password(create_user_entity.password)

        user = await self.users_repository.create(user)

        return UserRead.model_validate(user)

    @staticmethod
    def is_strong_password(password: str) -> bool:
        if len(password) < 8:
            return False

        if not re.search(r'[A-Z]', password):
            return False

        if not re.search(r'[a-z]', password):
            return False

        if not re.search(r'\d', password):
            return False

        if not re.search(r'[!@#$%^&*(),.?\':{}|<>]', password):
            return False

        return True
