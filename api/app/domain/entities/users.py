from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.domain.entities.roles import RoleRead
from app.domain.entities.statuses import StatusRead


class UserRegister(BaseModel):
    first_name: str = Field(max_length=250)
    last_name: str = Field(max_length=250)
    patronymic: Optional[str] = Field(default=None, max_length=250)
    login: str = Field(max_length=250)
    email: Optional[EmailStr] = None
    birthdate: date
    password: str = Field(min_length=8)
    repeat_password: str = Field(min_length=8)


class UserCreate(BaseModel):
    first_name: str = Field(max_length=250)
    last_name: str = Field(max_length=250)
    patronymic: Optional[str] = Field(default=None, max_length=250)
    login: str = Field(max_length=250)
    email: Optional[EmailStr] = None
    birthdate: date
    password: str = Field(min_length=8)
    repeat_password: str = Field(min_length=8)
    role_id: int = Field()


class UserUpdate(BaseModel):
    first_name: str = Field(max_length=250)
    last_name: str = Field(max_length=250)
    patronymic: Optional[str] = Field(default=None, max_length=250)
    email: Optional[EmailStr] = None
    birthdate: date


class PasswordChangeRequest(BaseModel):
    password: str
    repeat_password: str


class UserRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    login: str
    email: Optional[EmailStr]
    birthdate: date
    status_id: int
    role_id: int

    role: RoleRead
    status: StatusRead

    class Config:
        from_attributes = True
