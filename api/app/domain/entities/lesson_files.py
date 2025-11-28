from pydantic import BaseModel


class ReadLessonFile(BaseModel):
    id: int
    filename: str
    file_path: str
    lesson_id: int

    class Config:
        from_attributes = True
