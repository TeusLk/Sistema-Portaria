from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    user: str
    email: EmailStr
    dominio: str
    status: Optional[bool] = True
    data_criacao: Optional[datetime] = None

class UserCreate(UserBase):
    senha: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    senha: str
    dominio: str 