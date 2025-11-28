from typing import Optional
from pydantic import BaseModel, Field

from app.domain.entities.users import UserRead


class LessonBase(BaseModel):
    title: str = Field(..., max_length=250)
    description: Optional[str] = None
    text: Optional[str] = None
    number: int = Field(..., ge=1)


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=250)
    description: Optional[str] = None
    text: Optional[str] = None
    number: Optional[int] = Field(None, ge=1)


class LessonRead(LessonBase):
    id: int
    course_id: int
    creator_id: int

    creator: UserRead

    class Config:
        from_attributes = True
