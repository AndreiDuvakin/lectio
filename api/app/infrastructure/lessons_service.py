from fastapi import HTTPException, status
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.courses_repository import CoursesRepository
from app.application.lessons_repository import LessonsRepository
from app.domain.entities.lessons import LessonCreate, LessonUpdate, LessonRead
from app.domain.models import Lesson, User
from app.settings import Settings


class LessonsService:
    def __init__(self, db: AsyncSession):
        self.lessons_repository = LessonsRepository(db)
        self.courses_repository = CoursesRepository(db)
        self.settings = Settings()

    async def get_all_by_course(self, course_id: int) -> List[LessonRead]:
        lessons = await self.lessons_repository.get_all_by_course(course_id)
        response = []

        for lesson in lessons:
            response.append(LessonRead.model_validate(lesson))

        return response

    async def get_by_id(self, lesson_id: int) -> LessonRead:
        lesson = await self.lessons_repository.get_by_id(lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Урок не найден"
            )
        return LessonRead.model_validate(lesson)

    async def create(self, lesson_data: LessonCreate, creator: User, course_id) -> LessonRead:
        course_model = await self.courses_repository.get_by_id(course_id)
        if not course_model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Курс не найден"
            )

        lesson = Lesson(
            title=lesson_data.title,
            description=lesson_data.description,
            text=lesson_data.text,
            number=lesson_data.number,
            course_id=course_id,
            creator_id=creator.id
        )

        created_lesson = await self.lessons_repository.create(lesson)
        return LessonRead.model_validate(created_lesson)

    async def update(self, lesson_id: int, lesson_data: LessonUpdate, current_user: User) -> Optional[LessonRead]:
        lesson = await self.lessons_repository.get_by_id(lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Урок не найден"
            )

        is_admin = current_user.role.title == self.settings.root_role_name
        if lesson.creator_id != current_user.id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступ запрещён"
            )

        update_dict = lesson_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(lesson, key, value)

        updated_lesson = await self.lessons_repository.update(lesson)
        return LessonRead.model_validate(updated_lesson)

    async def delete(self, lesson_id: int, current_user: User) -> None:
        lesson = await self.lessons_repository.get_by_id(lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Урок не найден"
            )

        is_admin = current_user.role.title == self.settings.root_role_name
        if lesson.creator_id != current_user.id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступ запрещён"
            )

        await self.lessons_repository.delete(lesson)
