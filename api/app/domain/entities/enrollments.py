from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class EnrollmentCreate(BaseModel):
    course_id: int = Field()
    student_id: int = Field()


class EnrollmentRead(BaseModel):
    id: int
    course_id: int
    student_id: int
    enrollment_date: datetime

    class Config:
        from_attributes = True
