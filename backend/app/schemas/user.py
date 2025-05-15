from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    domain: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    domain: str 