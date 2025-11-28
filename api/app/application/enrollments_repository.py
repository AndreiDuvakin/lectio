from typing import List, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Enrollment


class EnrollmentsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_course_id(self, course_id: int) -> Sequence[Enrollment]:
        query = (
            select(Enrollment)
            .filter_by(course_id=course_id)
        )
        results = await self.db.execute(query)
        return results.scalars().all()

    async def get_by_student_id(self, student_id: int) -> Sequence[Enrollment]:
        query = (
            select(Enrollment)
            .filter_by(student_id=student_id)
        )
        results = await self.db.execute(query)
        return results.scalars().all()

    async def create_list(self, enrollments: List[Enrollment]) -> List[Enrollment]:
        self.db.add_all(enrollments)
        await self.db.commit()

        for enrollment in enrollments:
            await self.db.refresh(enrollment)

        return enrollments

    async def delete_list(self, enrollments: List[Enrollment] | Sequence[Enrollment]) -> List[Enrollment]:
        for enrollment in enrollments:
            await self.db.delete(enrollment)

        await self.db.commit()
        return enrollments
