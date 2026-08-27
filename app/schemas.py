from datetime import date
from typing import Literal

# from h11 import Data
from pydantic import BaseModel, ConfigDict, EmailStr ,Field


UserRole = Literal["employee", "admin"]


class DepartmentBase(BaseModel):
    name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentResponse(DepartmentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)    #Pydantic knows how to convert a SQLAlchemy object into the schema automatically.


class DepartmentUpdate(BaseModel):
    name:str




class UserCreate(BaseModel):        #Data received from the user (request body).
    username: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole = "employee"     #Only an admin can create users, so it may set this.


class UserResponse(BaseModel):          #Data sent back to the user (response body).
    id: int
    username: str
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email:EmailStr
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str


class EmployeeCreate(BaseModel):
    user_id: int
    department_id: int | None = None
    full_name: str
    designation: str | None = None
    phone: str | None = None
    joining_date: date | None = None


class EmployeeResponse(BaseModel):
    id: int
    user_id: int
    department_id: int | None
    full_name: str
    designation: str | None
    phone: str | None
    joining_date: date | None

    model_config = ConfigDict(from_attributes=True)


class EmployeeUpdate(BaseModel):
    user_id: int | None = None
    department_id: int | None = None
    full_name: str | None = None
    designation: str | None = None
    phone: str | None = None
    joining_date: date | None = None