from http.client import HTTPException
from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.solution_comments_repository import SolutionCommentsRepository
from app.application.solutions_repository import SolutionsRepository
from app.domain.entities.solutions import SolutionCommentRead, SolutionCommentCreate
from app.domain.models import User, SolutionComment


class SolutionCommentsService:
    def __init__(self, db: AsyncSession):
        self.solution_comments_repository = SolutionCommentsRepository(db)
        self.solutions_repository = SolutionsRepository(db)

    async def get_by_id(self, comment_id) -> Optional[SolutionCommentRead]:
        comment_model = await self.solution_comments_repository.get_by_id(comment_id)

        if comment_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Комментарий не найден"
            )

        return SolutionCommentRead.model_validate(comment_model)

    async def get_by_solution_id(self, solution_id) -> Optional[List[SolutionCommentRead]]:
        solution_model = await self.solutions_repository.get_by_id(solution_id)

        if solution_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Решение не найдено"
            )

        comments = await self.solution_comments_repository.get_by_solution_id(solution_id)
        response = []
        for comment in comments:
            response.append(SolutionCommentRead.model_validate(comment))

        return response

    async def create(
            self, comment: SolutionCommentCreate, user: User, solution_id: int
    ) -> Optional[SolutionCommentRead]:
        solution_model = await self.solutions_repository.get_by_id(solution_id)

        if solution_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Решение не найдено"
            )

        comment_model = SolutionComment(
            comment_text=comment.comment_text,
            comment_autor_id=user.id,
            solution_id=solution_model.id,
        )

        comment_model = await self.solution_comments_repository.create(comment_model)

        return SolutionCommentRead.model_validate(comment_model)

    async def delete(self, comment_id: int) -> None:
        comment_model = await self.solution_comments_repository.get_by_id(comment_id)

        if comment_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Комментарий не найден"
            )

        await self.solution_comments_repository.delete(comment_model)
