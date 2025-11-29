import os
import uuid
from typing import List

import aiofiles
from fastapi import UploadFile, HTTPException
from starlette.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from werkzeug.utils import secure_filename

from app.application.task_files_repository import TaskFilesRepository
from app.application.tasks_repository import TasksRepository
from app.domain.entities.task_files import ReadTaskFile
from app.domain.models import TaskFile


class TaskFilesService:
    def __init__(self, db: AsyncSession):
        self.task_files_repository = TaskFilesRepository(db)
        self.tasks_repository = TasksRepository(db)

    async def get_file_by_id(self, file_id: int) -> FileResponse:
        task_file = await self.task_files_repository.get_by_id(file_id)

        if not task_file:
            raise HTTPException(404, "Файл с таким ID не найден")

        return FileResponse(
            task_file.file_path,
            media_type=self.get_media_type(task_file.filename),
            filename=os.path.basename(task_file.filename),
        )

    async def get_files_list_by_task(self, task_id: int) -> List[ReadTaskFile]:
        task = await self.tasks_repository.get_by_id(task_id)

        if task is None:
            raise HTTPException(404, "Лекционный материал не найден")

        task_files = await self.task_files_repository.get_by_task_id(task_id)

        response = []
        for task_file in task_files:
            response.append(
                ReadTaskFile.model_validate(
                    task_file
                )
            )

        return response

    async def upload_file(self, task_id: int, file: UploadFile) -> ReadTaskFile:
        task = await self.tasks_repository.get_by_id(task_id)

        if task is None:
            raise HTTPException(404, "Лекционный материал не найден")

        file_path = await self.save_file(file, f'uploads/tasks/{task.id}')

        task_file_model = TaskFile(
            filename=file.filename,
            file_path=file_path,
            task_id=task.id,
        )

        task_file_model = await self.task_files_repository.create(task_file_model)

        return ReadTaskFile.model_validate(task_file_model)

    async def delete_file(self, file_id: int) -> ReadTaskFile:
        task_file = await self.task_files_repository.get_by_id(file_id)

        if task_file is None:
            raise HTTPException(404, "Файл не найден")

        if not os.path.exists(task_file.file_path):
            raise HTTPException(404, "Файл не найден на диске")

        if os.path.exists(task_file.file_path):
            os.remove(task_file.file_path)

        task_file = await self.task_files_repository.delete(task_file)

        return ReadTaskFile.model_validate(task_file)

    async def save_file(self, file: UploadFile, upload_dir: str = 'uploads/tasks') -> str:
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
