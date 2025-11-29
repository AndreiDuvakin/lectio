from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field

from app.domain.entities.course_teachers import CourseTeacherRead
from app.domain.entities.enrollments import EnrollmentRead


class CourseBase(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    photo_filename: Optional[str] = None
    photo_path: Optional[str] = None

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    title: str = Field(max_length=250)
    description: Optional[str] = Field(default=None, max_length=1000)


class CourseUpdate(CourseCreate):
    pass


class CourseRead(CourseBase):
    teachers: List[CourseTeacherRead] = []
    enrollments: List[EnrollmentRead] = []

    class Config:
        from_attributes = True


class CourseCreated(CourseBase):
    class Config:
        from_attributes = True
