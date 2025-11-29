from typing import List, Optional

from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.solutions import SolutionCommentRead, SolutionCommentCreate
from app.domain.models import SolutionComment, User
from app.infrastructure.dependencies import require_auth_user
from app.infrastructure.solution_comments_service import SolutionCommentsService

solution_comments_router = APIRouter()


@solution_comments_router.get(
    '/solution/{solution_id}/',
    response_model=List[SolutionCommentRead],
    summary='Returns all comments for solution',
    description='Returns all comments for solution',
)
async def get_solution_comments(
        solution_id: int,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    solution_comments_service = SolutionCommentsService(db)
    return await solution_comments_service.get_by_solution_id(solution_id)

@solution_comments_router.post(
        '/solution/{solution_id}/',
    response_model=SolutionCommentRead,
    summary='Creates a new solution comment',
    description='Creates a new solution comment',
)
async def create_solution_comment(
        solution_id: int,
        solution_comment: SolutionCommentCreate,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    solution_comments_service = SolutionCommentsService(db)
    return await solution_comments_service.create(solution_comment, user, solution_id)

@solution_comments_router.delete(
    '/{comment_id}/',
    summary='Deletes a solution comment',
    description='Deletes a solution comment',
)
async def delete_solution_comment(
        comment_id: int,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    solution_comments_service = SolutionCommentsService(db)
    return await solution_comments_service.delete(comment_id)
