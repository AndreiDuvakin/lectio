from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    login: str = Field(max_length=250)
    password: str = Field(min_length=8)


class LoginResponse(BaseModel):
    user_id: int
    access_token: str
