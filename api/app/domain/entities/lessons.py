from typing import Optional
from pydantic import BaseModel, Field


class LessonBase(BaseModel):
    title: str = Field(..., max_length=250)
    description: Optional[str] = None
    text: Optional[str] = None
    number: int = Field(..., ge=1)


class LessonCreate(LessonBase):
    course_id: int


class LessonUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=250)
    description: Optional[str] = None
    text: Optional[str] = None
    number: Optional[int] = Field(None, ge=1)


class LessonRead(LessonBase):
    id: int
    course_id: int
    creator_id: int

    class Config:
        from_attributes = True
