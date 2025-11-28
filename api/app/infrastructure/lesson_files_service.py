import os
import uuid
from typing import List

import aiofiles
from fastapi import UploadFile, HTTPException
from starlette.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from werkzeug.utils import secure_filename

from app.application.lesson_files_repository import LessonFilesRepository
from app.application.lessons_repository import LessonsRepository
from app.domain.entities.lesson_files import ReadLessonFile
from app.domain.models import LessonFile


class LessonFilesService:
    def __init__(self, db: AsyncSession):
        self.lesson_files_repository = LessonFilesRepository(db)
        self.lessons_repository = LessonsRepository(db)

    async def get_file_by_id(self, file_id: int) -> FileResponse:
        lesson_file = self.lesson_files_repository.get_by_id(file_id)

        if not lesson_file:
            raise HTTPException(404, "Файл с таким ID не найден")

        return FileResponse(
            lesson_file.filename,
            media_type=self.get_media_type(lesson_file.filename),
            filename=os.path.basename(lesson_file.file_path),
        )

    async def get_files_list_by_lesson(self, lesson_id: int) -> List[ReadLessonFile]:
        lesson = await self.lessons_repository.get_by_id(lesson_id)

        if lesson is None:
            raise HTTPException(404, "Лекционный материал не найден")

        lesson_files = await self.lesson_files_repository.get_by_lesson_id(lesson_id)

        response = []
        for lesson_file in lesson_files:
            response.append(
                ReadLessonFile.model_validate(
                    lesson_file
                )
            )

        return response

    async def upload_file(self, lesson_id: int, file: UploadFile) -> ReadLessonFile:
        lesson = await self.lessons_repository.get_by_id(lesson_id)

        if lesson is None:
            raise HTTPException(404, "Лекционный материал не найден")

        file_path = await self.save_file(file, f'uploads/lessons/{lesson.id}')

        lesson_file_model = LessonFile(
            filename=file_path,
            file_path=file.filename,
            lesson_id=lesson.id,
        )

        lesson_file_model = await self.lesson_files_repository.create(lesson_file_model)

        return ReadLessonFile.model_validate(lesson_file_model)

    async def delete_file(self, file_id: int) -> ReadLessonFile:
        lesson_file = await self.lesson_files_repository.get_by_id(file_id)

        if lesson_file is None:
            raise HTTPException(404, "Файл не найден")

        if not os.path.exists(lesson_file.file_path):
            raise HTTPException(404, "Файл не найден на диске")

        if os.path.exists(lesson_file.file_path):
            os.remove(lesson_file.file_path)

        lesson_file = await self.lesson_files_repository.delete(lesson_file)

        return ReadLessonFile.model_validate(lesson_file)

    async def save_file(self, file: UploadFile, upload_dir: str = 'uploads/lessons') -> str:
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
