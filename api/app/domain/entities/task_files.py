from pydantic import BaseModel


class ReadTaskFile(BaseModel):
    id: int
    filename: str
    file_path: str
    task_id: int

    class Config:
        from_attributes = True
