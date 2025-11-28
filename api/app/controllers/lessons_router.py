from typing import List, Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.lessons import LessonCreate, LessonUpdate, LessonRead
from app.domain.models import User
from app.infrastructure.dependencies import require_auth_user, require_teacher, require_admin
from app.infrastructure.lessons_service import LessonsService

lessons_router = APIRouter()


@lessons_router.get(
    '/course/{course_id}/',
    response_model=Optional[List[LessonRead]],
    summary='Get all lessons by course',
    description='Get all lessons by course',
)
async def get_course_lessons(
        course_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    lessons_service = LessonsService(db)
    return await lessons_service.get_all_by_course(course_id)


@lessons_router.get(
    '/{lesson_id}/',
    response_model=Optional[LessonRead],
    summary='Get lesson by lesson ID',
    description='Get lesson by lesson ID',
)
async def get_lesson(
        lesson_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    lessons_service = LessonsService(db)
    return await lessons_service.get_by_id(lesson_id)


@lessons_router.post(
    '/{course_id}/',
    response_model=Optional[LessonRead],
    summary='Create a new lesson',
    description='Create a new lesson',
)
async def create_lesson(
        course_id: int,
        lesson_data: LessonCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    lessons_service = LessonsService(db)
    return await lessons_service.create(lesson_data, current_user, course_id)


@lessons_router.put(
    '/{lesson_id}/',
    response_model=Optional[LessonRead],
    summary='Update a lesson',
    description='Update a lesson',
)
async def update_lesson(
        lesson_id: int,
        lesson_data: LessonUpdate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    lessons_service = LessonsService(db)
    return await lessons_service.update(lesson_id, lesson_data, current_user)


@lessons_router.delete(
    '/{lesson_id}',
    response_model=Optional[LessonRead],
    summary='Delete a lesson',
    description='Delete a lesson',
)
async def delete_lesson(
        lesson_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    lessons_service = LessonsService(db)
    await lessons_service.delete(lesson_id, current_user)
    return None
