from typing import List, Optional

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.users import UserRead, UserUpdate, PasswordChangeRequest, UserCreate
from app.domain.models import User
from app.infrastructure.dependencies import require_auth_user, require_admin
from app.infrastructure.register_service import RegisterService
from app.infrastructure.users_service import UsersService

users_router = APIRouter()


@users_router.get(
    '/',
    response_model=List[UserRead],
    summary='Return all users',
    description='Return all users',
)
async def get_all_users(
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_admin)
):
    users_service = UsersService(db)
    return await users_service.get_all()


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


@users_router.put(
    '/{user_id}/',
    response_model=Optional[UserRead],
    summary='Updates user data',
    description='Updates user data',
)
async def update_user(
        user_id: int,
        user_data: UserUpdate,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user)
):
    users_service = UsersService(db)
    return await users_service.update(user_id, user_data, user)


@users_router.post(
    '/change-password/{user_id}/',
    response_model=Optional[UserRead],
    summary='Updates user data',
    description='Updates user data',
)
async def change_password(
        user_id: int,
        password_data: PasswordChangeRequest,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user)
):
    users_service = UsersService(db)
    return await users_service.change_password(user_id, password_data, user)


@users_router.post(
    '/create/',
    response_model=Optional[UserRead],
    summary='Creates a new user',
    description='Creates a new user',
)
async def create_user(
        user: UserCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_admin)
):
    register_service = RegisterService(db)
    return await register_service.create_user(user)


@users_router.get(
    '/role/{role_name}/',
    response_model=List[UserRead],
    summary='Return all users with given role',
    description='Return all users with given role',
)
async def get_users_by_role_name(
        role_name: str,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    users_service = UsersService(db)
    return await users_service.get_by_role_name(role_name)
