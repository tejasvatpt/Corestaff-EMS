from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session 

from ..database import get_db
from ..models import Department, User, Employee
from ..schemas import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
    EmployeeResponse,
)
from ..auth import get_current_user, admin_required

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.post("", response_model=DepartmentResponse)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    name_clean = department.name.strip()
    if not name_clean:
        raise HTTPException(status_code=400, detail="Department name cannot be empty.")

    existing = db.query(Department).filter(Department.name.ilike(name_clean)).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Department '{name_clean}' already exists."
        )

    new_department = Department(name=name_clean)
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return DepartmentResponse(id=new_department.id, name=new_department.name, employee_count=0)


@router.get("", response_model=list[DepartmentResponse])
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    departments = db.query(Department).order_by(Department.name.asc()).all()
    results = []
    for dept in departments:
        count = len(dept.employees)
        results.append(
            DepartmentResponse(
                id=dept.id,
                name=dept.name,
                employee_count=count
            )
        )
    return results


@router.get("/{department_id}/employees", response_model=list[EmployeeResponse])
def get_department_employees(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept.employees


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    db_department = db.query(Department).filter(Department.id == department_id).first()

    if db_department is None:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    name_clean = department.name.strip()
    if not name_clean:
        raise HTTPException(status_code=400, detail="Department name cannot be empty.")

    existing = db.query(Department).filter(
        Department.name.ilike(name_clean),
        Department.id != department_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Department '{name_clean}' already exists."
        )

    db_department.name = name_clean
    db.commit()
    db.refresh(db_department)

    count = len(db_department.employees)
    return DepartmentResponse(id=db_department.id, name=db_department.name, employee_count=count)


@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    db_department = db.query(Department).filter(Department.id == department_id).first()

    if db_department is None:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    # Safely unassign all employees assigned to this department
    for emp in db_department.employees:
        emp.department_id = None

    db.delete(db_department)
    db.commit()

    return {"message": "Department deleted successfully"}
