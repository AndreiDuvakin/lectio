from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.users import UserRead, UserRegister, UserCreate
from app.infrastructure.dependencies import require_admin
from app.infrastructure.register_service import RegisterService

register_router = APIRouter()


@register_router.post(
    '/register/',
    response_model=UserRead,
    summary='User registration',
    description='Performs user registration in the system',
)
async def register_user(
        user_data: UserRegister,
        db: AsyncSession = Depends(get_db)
):
    register_service = RegisterService(db)
    return await register_service.user_register(user_data)


@register_router.post(
    '/create/',
    response_model=UserRead,
    summary='User creation',
    description='Performs user creation in the system',
)
async def create_user(
        user_data: UserCreate,
        user=Depends(require_admin),
        db: AsyncSession = Depends(get_db)
):
    register_service = RegisterService(db)
    return await register_service.create_user(user_data)
