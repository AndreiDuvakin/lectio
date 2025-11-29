from typing import Optional
from pydantic import BaseModel, Field

from app.domain.entities.users import UserRead


class TaskBase(BaseModel):
    title: str = Field(..., max_length=250)
    description: Optional[str] = None
    text: Optional[str] = None
    number: int = Field(..., ge=1)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: int
    course_id: int
    creator_id: int

    creator: UserRead

    class Config:
        from_attributes = True
