from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Lesson, UserCheckLessons


class UserCheckLessonsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_course_id_and_user_id(self, course_id: int, user_id: int) -> Optional[List[UserCheckLessons]]:
        query = (
            select(UserCheckLessons)
            .join(Lesson, UserCheckLessons.lesson_id == Lesson.id)  # связь с лекцией
            .where(
                Lesson.course_id == course_id,
                UserCheckLessons.user_id == user_id
            )
        )
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_user_id_and_lesson_id(self, user_id: int, lesson_id: int) -> Optional[UserCheckLessons]:
        query = (
            select(UserCheckLessons)
            .filter_by(user_id=user_id, lesson_id=lesson_id)
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create(self, user_check_lessons: UserCheckLessons) -> UserCheckLessons:
        self.db.add(user_check_lessons)
        await self.db.commit()
        return user_check_lessons
