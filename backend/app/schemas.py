from datetime import datetime

from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class DesignCreate(BaseModel):
    title: str
    description: str = ""
    pattern_type: str = "pixel_art"
    width: int = 32
    height: int = 32
    canvas_data: str | None = None


class DesignResponse(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    user_id: int
    pattern_type: str
    width: int
    height: int
    canvas_data: str | None

    class Config:
        from_attributes = True
