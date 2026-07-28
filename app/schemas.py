from pydantic import BaseModel


class DepartmentBase(BaseModel):
    name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        from_attributes = True     #Pydantic knows how to convert a SQLAlchemy object into the schema automatically.


class DepartmentUpdate(BaseModel):
    name:str