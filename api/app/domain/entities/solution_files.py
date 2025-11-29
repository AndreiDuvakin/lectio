from pydantic import BaseModel


class ReadSolutionFile(BaseModel):
    id: int
    filename: str
    file_path: str
    solution_id: int

    class Config:
        from_attributes = True
