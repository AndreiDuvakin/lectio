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


class AssessmentCreate(BaseModel):
    assessment: int = Field(...)


class SolutionCommentBase(BaseModel):
    comment_text: str = Field(...)


class SolutionCommentCreate(SolutionCommentBase):
    pass


class SolutionCommentRead(SolutionCommentBase):
    comment_autor_id: int
    solution_id: int

    comment_autor: UserRead

    class Config:
        from_attributes = True


class SolutionRead(SolutionAfterCreate):
    created_at: datetime

    files: Optional[List[ReadSolutionFile]] = []
    solution_comments: Optional[List[SolutionCommentRead]] = []

    class Config:
        from_attributes = True
