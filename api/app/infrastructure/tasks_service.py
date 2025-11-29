import os
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.courses_repository import CoursesRepository
from app.application.task_files_repository import TaskFilesRepository
from app.application.tasks_repository import TasksRepository
from app.domain.entities.tasks import TaskCreate, TaskUpdate
from app.domain.entities.tasks import TaskRead
from app.domain.models import User, Task
from app.settings import Settings


class TasksService:
    def __init__(self, db: AsyncSession):
        self.tasks_repository = TasksRepository(db)
        self.courses_repository = CoursesRepository(db)
        self.task_files_repository = TaskFilesRepository(db)
        self.settings = Settings()

    async def get_all_by_course(self, course_id: int) -> List[TaskRead]:
        tasks = await self.tasks_repository.get_all_by_course(course_id)
        response = []

        for task in tasks:
            response.append(TaskRead.model_validate(task))

        return response

    async def get_by_id(self, task_id: int) -> TaskRead:
        task = await self.tasks_repository.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Задание не найдено"
            )
        return TaskRead.model_validate(task)

    async def create(self, task_data: TaskCreate, creator: User, course_id) -> TaskRead:
        course_model = await self.courses_repository.get_by_id(course_id)
        if not course_model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Курс не найден"
            )

        task = Task(
            title=task_data.title,
            description=task_data.description,
            text=task_data.text,
            number=task_data.number,
            course_id=course_id,
            creator_id=creator.id
        )

        created_task = await self.tasks_repository.create(task)
        return TaskRead.model_validate(created_task)

    async def update(self, task_id: int, task_data: TaskUpdate, current_user: User) -> Optional[TaskRead]:
        task = await self.tasks_repository.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Задание не найдено"
            )

        is_admin = current_user.role.title == self.settings.root_role_name
        if task.creator_id != current_user.id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступ запрещён"
            )

        update_dict = task_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(task, key, value)

        updated_task = await self.tasks_repository.update(task)
        return TaskRead.model_validate(updated_task)

    async def delete(self, task_id: int, current_user: User) -> None:
        task = await self.tasks_repository.get_by_id(task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Задание не найдено"
            )

        is_admin = current_user.role.title == self.settings.root_role_name
        if task.creator_id != current_user.id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступ запрещён"
            )

        task_files = await self.task_files_repository.get_by_task_id(task_id)
        for file in task_files:
            task_file = await self.task_files_repository.get_by_id(file.id)

            if task_file is None:
                raise HTTPException(404, "Файл не найден")

            if not os.path.exists(task_file.file_path):
                raise HTTPException(404, "Файл не найден на диске")

            if os.path.exists(task_file.file_path):
                os.remove(task_file.file_path)

            await self.task_files_repository.delete(task_file)

        await self.tasks_repository.delete(task)
