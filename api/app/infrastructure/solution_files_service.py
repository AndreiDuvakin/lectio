import os
import uuid
from typing import List

import aiofiles
from fastapi import UploadFile, HTTPException
from starlette.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from werkzeug.utils import secure_filename

from app.application.solution_files_repository import SolutionFilesRepository
from app.application.solutions_repository import SolutionsRepository
from app.domain.entities.solution_files import ReadSolutionFile
from app.domain.models import SolutionFile


class SolutionFilesService:
    def __init__(self, db: AsyncSession):
        self.solution_files_repository = SolutionFilesRepository(db)
        self.solutions_repository = SolutionsRepository(db)

    async def get_file_by_id(self, file_id: int) -> FileResponse:
        solution_file = await self.solution_files_repository.get_by_id(file_id)

        if not solution_file:
            raise HTTPException(404, "Файл с таким ID не найден")

        return FileResponse(
            solution_file.file_path,
            media_type=self.get_media_type(solution_file.filename),
            filename=os.path.basename(solution_file.filename),
        )

    async def get_files_list_by_solution(self, solution_id: int) -> List[ReadSolutionFile]:
        solution = await self.solutions_repository.get_by_id(solution_id)

        if solution is None:
            raise HTTPException(404, "Лекционный материал не найден")

        solution_files = await self.solution_files_repository.get_by_solution_id(solution_id)

        response = []
        for solution_file in solution_files:
            response.append(
                ReadSolutionFile.model_validate(
                    solution_file
                )
            )

        return response

    async def upload_file(self, solution_id: int, file: UploadFile) -> ReadSolutionFile:
        solution = await self.solutions_repository.get_by_id(solution_id)

        if solution is None:
            raise HTTPException(404, "Лекционный материал не найден")

        file_path = await self.save_file(file, f'uploads/solutions/{solution.id}')

        solution_file_model = SolutionFile(
            filename=file.filename,
            file_path=file_path,
            solution_id=solution.id,
        )

        solution_file_model = await self.solution_files_repository.create(solution_file_model)

        return ReadSolutionFile.model_validate(solution_file_model)

    async def delete_file(self, file_id: int) -> ReadSolutionFile:
        solution_file = await self.solution_files_repository.get_by_id(file_id)

        if solution_file is None:
            raise HTTPException(404, "Файл не найден")

        if not os.path.exists(solution_file.file_path):
            raise HTTPException(404, "Файл не найден на диске")

        if os.path.exists(solution_file.file_path):
            os.remove(solution_file.file_path)

        solution_file = await self.solution_files_repository.delete(solution_file)

        return ReadSolutionFile.model_validate(solution_file)

    async def save_file(self, file: UploadFile, upload_dir: str = 'uploads/solutions') -> str:
        os.makedirs(upload_dir, exist_ok=True)
        filename = self.generate_filename(file)
        file_path = os.path.join(upload_dir, filename)

        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        return file_path

    @staticmethod
    def generate_filename(file: UploadFile) -> str:
        return secure_filename(f"{uuid.uuid4()}_{file.filename}")

    @staticmethod
    def get_media_type(filename: str) -> str:
        extension = filename.split('.')[-1].lower()
        if extension in ['jpeg', 'jpg', 'png']:
            return f"image/{extension}"
        if extension == 'pdf':
            return "application/pdf"
        if extension in ['zip']:
            return "application/zip"
        if extension in ['doc', 'docx']:
            return "application/msword"
        if extension in ['xls', 'xlsx']:
            return "application/vnd.ms-excel"
        if extension in ['ppt', 'pptx']:
            return "application/vnd.ms-powerpoint"
        if extension in ['txt']:
            return "text/plain"

        return "application/octet-stream"
