from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session 

from ..database import get_db
from ..models import Department
from ..schemas import DepartmentCreate, DepartmentResponse, DepartmentUpdate

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("", response_model=DepartmentResponse)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):    

    new_department = Department(name=department.name)
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department


@router.get("", response_model=list[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    return departments


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db)
):
    db_department = db.query(Department).filter(Department.id == department_id).first()

    if db_department is None:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    db_department.name = department.name

    db.commit()
    db.refresh(db_department)

    return db_department



@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    db_department = db.query(Department).filter(Department.id == department_id).first()

    if db_department is None:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    db.delete(db_department)
    db.commit()

    return {"message": "Department deleted successfully"}
