from pydantic import BaseModel, EmailStr, Field


class CourseTeacherCreate(BaseModel):
    course_id: int = Field()
    teacher_id: int = Field()


class CourseTeacherRead(BaseModel):
    id: int
    course_id: int
    teacher_id: int

    class Config:
        from_attributes = True
