import os
from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.solution_files_repository import SolutionFilesRepository
from app.application.solutions_repository import SolutionsRepository
from app.application.tasks_repository import TasksRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.solutions import SolutionRead, SolutionCreate, SolutionAfterCreate, AssessmentCreate
from app.domain.models import User, Solution
from app.settings import Settings


class SolutionsService:
    def __init__(self, db: AsyncSession):
        self.solutions_repository = SolutionsRepository(db)
        self.tasks_repository = TasksRepository(db)
        self.users_repository = UsersRepository(db)
        self.solution_files_repository = SolutionFilesRepository(db)
        self.settings = Settings()

    async def get_by_task_id(self, task_id: int) -> Optional[List[SolutionRead]]:
        task_model = await self.tasks_repository.get_by_id(task_id)

        if task_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Задание не найдено"
            )

        solutions = await self.solutions_repository.get_by_task_id(task_id)

        response = []
        for solution in solutions:
            response.append(
                SolutionRead.model_validate(solution)
            )

        return response

    async def get_by_task_id_and_student_id(self, task_id: int, student_id: int) -> Optional[List[SolutionRead]]:
        task_model = await self.tasks_repository.get_by_id(task_id)

        if task_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Задание не найдено"
            )

        student_model = await self.users_repository.get_by_id(student_id)

        if student_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Такой пользователь не найден"
            )

        solutions = await self.solutions_repository.get_by_task_id_and_student_id(task_id, student_id)

        response = []
        for solution in solutions:
            response.append(
                SolutionRead.model_validate(solution)
            )

        return response

    async def create_assessment(self, solution_id: int, assessment: AssessmentCreate, user: User) -> None:
        solution_model = await self.solutions_repository.get_by_id(solution_id)

        if solution_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Такого решения не найдено"
            )

        solution_model.assessment = assessment.assessment
        solution_model.assessment_autor_id = user.id

        await self.solutions_repository.update(solution_model)

    async def create(self, solution: SolutionCreate, creator: User, task_id: int) -> SolutionAfterCreate:
        task_model = await self.tasks_repository.get_by_id(task_id)

        if task_model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Задание не найдено"
            )

        model_solution = Solution(
            answer_text=solution.answer_text,
            assessment=solution.assessment,
            task_id=task_id,
            student_id=creator.id,
        )
        created_solution = await self.solutions_repository.create(model_solution)
        return SolutionAfterCreate.model_validate(created_solution)

    async def delete(self, solution_id: int, current_user: User) -> Optional[SolutionRead]:
        solution = await self.solutions_repository.get_by_id(solution_id)
        if solution is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='Такое решение не найдено'
            )

        is_admin = current_user.role.title == self.settings.root_role_name
        if solution.student_id != current_user.id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Доступ запрещён"
            )

        solution_files = await self.solution_files_repository.get_by_solution_id(solution.id)
        for file in solution_files:
            solution_file = await self.solution_files_repository.get_by_id(file.id)

            if solution_file is None:
                raise HTTPException(404, "Файл не найден")

            if not os.path.exists(solution_file.file_path):
                raise HTTPException(404, "Файл не найден на диске")

            if os.path.exists(solution_file.file_path):
                os.remove(solution_file.file_path)

            await self.solution_files_repository.delete(solution_file)

        await self.solutions_repository.delete(solution)
