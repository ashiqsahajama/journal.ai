from pydantic import BaseModel, EmailStr
from datetime import datetime

# Base user fields used across schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

# Incoming data for sign-up
class UserCreate(UserBase):
    password: str  # plain password (will be hashed in backend)

# Incoming data for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Outgoing user data after signup/login (no password!)
class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True