from typing import List, Optional

from fastapi import APIRouter, Depends, status, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import FileResponse

from app.database.session import get_db
from app.domain.entities.task_files import ReadTaskFile
from app.domain.entities.tasks import TaskRead, TaskCreate
from app.domain.models import User
from app.infrastructure.dependencies import require_auth_user, require_teacher
from app.infrastructure.task_files_service import TaskFilesService
from app.infrastructure.tasks_service import TasksService

tasks_router = APIRouter()


@tasks_router.get(
    '/course/{course_id}/',
    response_model=Optional[List[TaskRead]],
    summary='Get all tasks by course',
    description='Get all tasks by course',
)
async def get_course_tasks(
        course_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    tasks_service = TasksService(db)
    return await tasks_service.get_all_by_course(course_id)


@tasks_router.get(
    '/{task_id}/',
    response_model=Optional[TaskRead],
    summary='Get task by task ID',
    description='Get task by task ID',
)
async def get_task(
        task_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    tasks_service = TasksService(db)
    return await tasks_service.get_by_id(task_id)


@tasks_router.post(
    '/{course_id}/',
    response_model=Optional[TaskRead],
    summary='Create a new task',
    description='Create a new task',
)
async def create_task(
        course_id: int,
        task_data: TaskCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    tasks_service = TasksService(db)
    return await tasks_service.create(task_data, current_user, course_id)


@tasks_router.put(
    '/{task_id}/',
    response_model=Optional[TaskRead],
    summary='Update a task',
    description='Update a task',
)
async def update_task(
        task_id: int,
        task_data: TaskCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    tasks_service = TasksService(db)
    return await tasks_service.update(task_id, task_data, current_user)


@tasks_router.delete(
    '/{task_id}/',
    response_model=Optional[TaskRead],
    summary='Delete a task',
    description='Delete a task',
)
async def delete_task(
        task_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    tasks_service = TasksService(db)
    return await tasks_service.delete(task_id, current_user)


@tasks_router.get(
    '/files/{task_id}/',
    response_model=Optional[List[ReadTaskFile]],
    summary='Get a files list by task ID',
    description='Get a files list by task ID',
)
async def get_files(
        task_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    task_files_service = TaskFilesService(db)
    return await task_files_service.get_files_list_by_task(task_id)


@tasks_router.get(
    '/file/{file_id}/',
    response_class=FileResponse,
)
async def get_file(
        file_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    task_files_service = TaskFilesService(db)
    return await task_files_service.get_file_by_id(file_id)


@tasks_router.post(
    '/files/{task_id}/upload/',
    response_model=ReadTaskFile,
    summary='Upload a file',
    description='Upload a file',
)
async def upload_file(
        task_id: int,
        file: UploadFile = File(...),
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_teacher),
):
    task_files_service = TaskFilesService(db)
    return await task_files_service.upload_file(task_id, file)


@tasks_router.delete(
    '/files/{file_id}/',
    response_model=Optional[ReadTaskFile],
    summary='Delete a file',
    description='Delete a file',
)
async def delete_file(
        file_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    task_files_service = TaskFilesService(db)
    return await task_files_service.delete_file(file_id)
