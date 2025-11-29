from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import SolutionFile


class SolutionFilesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, file_id: int) -> Optional[SolutionFile]:
        query = (
            select(SolutionFile)
            .filter_by(id=file_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_solution_id(self, solution_id: int) -> Sequence[Optional[SolutionFile]]:
        query = (
            select(SolutionFile)
            .filter_by(solution_id=solution_id)
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, solution_file: SolutionFile) -> SolutionFile:
        self.db.add(solution_file)
        await self.db.commit()
        await self.db.refresh(solution_file)
        return solution_file

    async def delete(self, solution_file: SolutionFile) -> SolutionFile:
        await self.db.delete(solution_file)
        await self.db.commit()
        return solution_file
