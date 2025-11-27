from pydantic import BaseModel


class StatusRead(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True
