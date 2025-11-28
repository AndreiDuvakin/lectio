from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class EnrollmentCreate(BaseModel):
    student_id: int = Field()


class EnrollmentRead(BaseModel):
    id: int
    course_id: int
    student_id: int
    enrollment_date: Optional[datetime] = None

    class Config:
        from_attributes = True
