from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.auth import LoginRequest, LoginResponse
from app.infrastructure.auth_service import AuthService

auth_router = APIRouter()


@auth_router.post(
    '/login/',
    response_model=LoginResponse,
    summary='User authentication',
    description='Logs in the user and outputs the `access_token` ',
)
async def auth_user(
        user_data: LoginRequest,
        db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    return await auth_service.authenticate_user(user_data)
