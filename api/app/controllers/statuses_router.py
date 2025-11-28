from typing import List, Optional

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.statuses import StatusRead
from app.domain.models import User
from app.infrastructure.dependencies import require_auth_user
from app.infrastructure.statuses_servise import StatusesService

statuses_router = APIRouter()


@statuses_router.get(
    '/',
    response_model=List[StatusRead],
    summary='Return all statuses',
    description='Return all statuses',
)
async def get_statuses(
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    statuses_service = StatusesService(db)
    return await statuses_service.get_all()
