from typing import List, Optional, Dict
from pydantic import BaseModel


class LessonInfo(BaseModel):
    id: int
    title: str
    number: int

    class Config:
        from_attributes = True


class TaskInfo(BaseModel):
    id: int
    title: str
    number: int
    max_points: int = 100

    class Config:
        from_attributes = True


class StudentProgress(BaseModel):
    student_id: int
    first_name: str
    last_name: str
    patronymic: str = ""
    read_lesson_ids: List[int] = []
    task_grades: Dict[int, Optional[int]]

    class Config:
        from_attributes = True


class GradeBookRead(BaseModel):
    course_id: int
    course_title: str
    lessons: List[LessonInfo]
    tasks: List[TaskInfo]
    students: List[StudentProgress]

    class Config:
        from_attributes = True