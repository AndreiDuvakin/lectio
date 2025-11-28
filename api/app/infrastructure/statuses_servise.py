from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.statuses_repository import StatusesRepository
from app.domain.entities.statuses import StatusRead


class StatusesService:
    def __init__(self, db: AsyncSession):
        self.statuses_repository = StatusesRepository(db)

    async def get_all(self) -> List[StatusRead]:
        statuses = await self.statuses_repository.get_all()
        response = []
        for status in statuses:
            response.append(
                StatusRead.model_validate(status)
            )

        return response
