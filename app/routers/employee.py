import re
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Employee, User, Department
from ..schemas import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
    EmployeeOnboardRequest,
    EmployeeOnboardResponse,
)
from ..auth import get_current_user, admin_required
from ..utils import hash_password


router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


def format_employee_response(emp: Employee) -> EmployeeResponse:
    return EmployeeResponse(
        id=emp.id,
        user_id=emp.user_id,
        department_id=emp.department_id,
        full_name=emp.full_name,
        designation=emp.designation,
        phone=emp.phone,
        joining_date=emp.joining_date,
        department_name=emp.department.name if emp.department else None,
        email=emp.user.email if emp.user else None,
        username=emp.user.username if emp.user else None,
    )


@router.get("/me", response_model=EmployeeResponse)
def get_my_employee_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve the employee profile linked to the currently authenticated user."""
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee profile not found for current user"
        )
    return format_employee_response(employee)


@router.get("", response_model=list[EmployeeResponse])
def get_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employees = db.query(Employee).all()
    return [format_employee_response(e) for e in employees]


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return format_employee_response(employee)


@router.post("/onboard", response_model=EmployeeOnboardResponse)
def onboard_employee(
    data: EmployeeOnboardRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Admin-only: creates User account and Employee profile atomically.
    Returns temporary credentials once.
    """
    # Check if email is already taken
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail=f"Email '{data.email}' is already registered."
        )

    # Generate a unique username
    base_username = re.sub(r'[^a-zA-Z0-9]', '', data.full_name.lower().replace(' ', '.'))
    if not base_username:
        base_username = data.email.split('@')[0]

    candidate_username = base_username
    counter = 1
    while db.query(User).filter(User.username == candidate_username).first():
        candidate_username = f"{base_username}{counter}"
        counter += 1

    # Generate a memorable secure temporary password: e.g. Emp@3a9b!
    hex_code = secrets.token_hex(3)
    temp_password = f"Emp@{hex_code}!"

    # Create User
    new_user = User(
        username=candidate_username,
        email=data.email,
        password_hash=hash_password(temp_password),
        role="employee",
    )
    db.add(new_user)
    db.flush()

    # Create Employee
    new_employee = Employee(
        user_id=new_user.id,
        department_id=data.department_id,
        full_name=data.full_name,
        designation=data.designation,
        phone=data.phone,
        joining_date=data.joining_date,
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    dept_name = new_employee.department.name if new_employee.department else None

    return EmployeeOnboardResponse(
        id=new_employee.id,
        user_id=new_user.id,
        full_name=new_employee.full_name,
        email=new_user.email,
        username=new_user.username,
        temp_password=temp_password,
        department_id=new_employee.department_id,
        department_name=dept_name,
        designation=new_employee.designation,
        phone=new_employee.phone,
        joining_date=new_employee.joining_date,
    )


@router.post("", response_model=EmployeeResponse)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    new_employee = Employee(
        user_id=employee.user_id,
        department_id=employee.department_id,
        full_name=employee.full_name,
        designation=employee.designation,
        phone=employee.phone,
        joining_date=employee.joining_date,
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return format_employee_response(new_employee)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    for field, value in employee_data.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)

    return format_employee_response(employee)


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}
