from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.domain.entities.solution_files import ReadSolutionFile
from app.domain.entities.users import UserRead


class SolutionBase(BaseModel):
    answer_text: str = Field(...)
    assessment: Optional[int] = Field(default=None)


class SolutionCreate(SolutionBase):
    pass


class SolutionAfterCreate(SolutionBase):
    id: int

    assessment_autor_id: Optional[int] = None
    assessment_autor: Optional[UserRead] = None
    student_id: int
    task_id: int = Field(...)

    class Config:
        from_attributes = True


class SolutionRead(SolutionAfterCreate):
    created_at: datetime

    files: Optional[List[ReadSolutionFile]] = []

    class Config:
        from_attributes = True
