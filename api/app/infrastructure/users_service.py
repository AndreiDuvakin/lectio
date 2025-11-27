import re
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.roles_repository import RolesRepository
from app.application.statuses_repository import StatusesRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.users import UserRegister, UserRead
from app.domain.models.users import User
from app.settings import Settings


class UsersService:
    def __init__(self, db: AsyncSession):
        pass
