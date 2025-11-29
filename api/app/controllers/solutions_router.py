from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Response, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import FileResponse

from app.database.session import get_db
from app.domain.entities.solution_files import ReadSolutionFile
from app.domain.entities.solutions import SolutionCreate, SolutionRead, SolutionAfterCreate, AssessmentCreate
from app.domain.models import User
from app.infrastructure.dependencies import require_auth_user, require_teacher
from app.infrastructure.solution_files_service import SolutionFilesService
from app.infrastructure.solutions_service import SolutionsService

solution_router = APIRouter()


@solution_router.get(
    '/task/{task_id}/',
    response_model=List[SolutionRead],
    summary='Get all solutions for task',
    description='Get all solutions for task',
)
async def get_solutions_by_task(
        task_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    service = SolutionsService(db)
    solutions = await service.get_by_task_id(task_id)
    return solutions


@solution_router.get(
    '/task/{task_id}/student/{student_id}/',
    response_model=List[SolutionRead],
    summary='Get all solutions for task',
    description='Get all solutions for task',
)
async def get_solutions_by_task_and_student(
        task_id: int,
        student_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    service = SolutionsService(db)
    solutions = await service.get_by_task_id_and_student_id(task_id, student_id)
    return solutions


@solution_router.post(
    '/{task_id}/',
    response_model=SolutionAfterCreate,
    status_code=status.HTTP_201_CREATED,
    summary='Send solution',
    description='Send solution',
)
async def create_solution(
        task_id: int,
        solution_data: SolutionCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    service = SolutionsService(db)
    return await service.create(solution_data, current_user, task_id)


@solution_router.delete(
    '/{solution_id}/',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Delete my solution',
    description='Delete my solution',
)
async def delete_solution(
        solution_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    service = SolutionsService(db)
    await service.delete(solution_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@solution_router.get(
    '/file/{file_id}/',
    response_class=FileResponse,
)
async def get_file(
        file_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    task_files_service = SolutionFilesService(db)
    return await task_files_service.get_file_by_id(file_id)


@solution_router.get(
    '/files/{solution_id}/',
    response_model=Optional[List[ReadSolutionFile]],
    summary='Get a files list by task ID',
    description='Get a files list by task ID',
)
async def get_files(
        solution_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_auth_user),
):
    task_files_service = SolutionFilesService(db)
    return await task_files_service.get_files_list_by_solution(solution_id)


@solution_router.post(
    '/files/{task_id}/upload/',
    response_model=ReadSolutionFile,
    summary='Upload a file',
    description='Upload a file',
)
async def upload_file(
        task_id: int,
        file: UploadFile = File(...),
        db: AsyncSession = Depends(get_db),
        user: User = Depends(require_auth_user),
):
    task_files_service = SolutionFilesService(db)
    return await task_files_service.upload_file(task_id, file)


@solution_router.post(
    '/assessment/{solution_id}/',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Set assessment for solution',
    description='Set assessment for solution',
)
async def create_assessment(
        solution_id: int,
        assessment_data: AssessmentCreate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    solutions_service = SolutionsService(db)
    await solutions_service.create_assessment(solution_id, assessment_data, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
