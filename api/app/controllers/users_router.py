from typing import List, Optional

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.users import UserRead
from app.domain.models import User
from app.infrastructure.dependencies import require_auth_user
from app.infrastructure.users_service import UsersService

users_router = APIRouter()


@users_router.get(
    '/me/',
    response_model=Optional[UserRead],
    summary='Returns current authenticated user data',
    description='Returns current authenticated user data',
)
async def get_authenticated_user_data(
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user)
):
    users_service = UsersService(db)
    return await users_service.get_by_id(user.id)
