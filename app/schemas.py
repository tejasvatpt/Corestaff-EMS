from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


UserRole = Literal["employee", "admin"]


# ─── Department ───────────────────────────────────────────────────────────────

class DepartmentBase(BaseModel):
    name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentResponse(DepartmentBase):
    id: int
    employee_count: int = 0
    model_config = ConfigDict(from_attributes=True)


class DepartmentUpdate(BaseModel):
    name: str


# ─── User ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole = "employee"


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


# ─── Employee ─────────────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    """Legacy: requires an existing user_id. Kept for compatibility."""
    user_id: int
    department_id: int | None = None
    full_name: str
    designation: str | None = None
    phone: str | None = None
    joining_date: date | None = None


class EmployeeOnboardRequest(BaseModel):
    """Admin-led onboarding: creates User + Employee in one call."""
    full_name: str
    email: EmailStr
    department_id: int | None = None
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
    # Enriched fields (populated by queries with joins)
    department_name: str | None = None
    email: str | None = None
    username: str | None = None
    model_config = ConfigDict(from_attributes=True)


class EmployeeOnboardResponse(BaseModel):
    """Returned once after onboarding — includes the plaintext temp password."""
    id: int
    user_id: int
    full_name: str
    email: str
    username: str
    temp_password: str
    department_id: int | None
    department_name: str | None
    designation: str | None
    phone: str | None
    joining_date: date | None


class EmployeeUpdate(BaseModel):
    department_id: int | None = None
    full_name: str | None = None
    designation: str | None = None
    phone: str | None = None
    joining_date: date | None = None


# ─── Dashboard ────────────────────────────────────────────────────────────────

class DepartmentDistributionItem(BaseModel):
    department_id: int | None = None
    department_name: str
    employee_count: int


class RecentEmployeeItem(BaseModel):
    id: int
    full_name: str
    designation: str | None = None
    department_name: str | None = None
    joining_date: date | None = None


class DashboardStatsResponse(BaseModel):
    total_employees: int
    total_departments: int
    present_today: int
    attendance_rate: float
    pending_leaves: int
    on_leave_today: int
    department_distribution: list[DepartmentDistributionItem]
    recent_employees: list[RecentEmployeeItem]


# ─── Attendance ───────────────────────────────────────────────────────────────

class AttendanceRecordResponse(BaseModel):
    id: int | None = None
    employee_id: int
    employee_name: str
    department_name: str | None = None
    date: date
    check_in: datetime | None = None
    check_out: datetime | None = None
    status: str
    punch_in_photo: str | None = None
    punch_out_photo: str | None = None
    model_config = ConfigDict(from_attributes=True)


class TodayAttendanceResponse(BaseModel):
    has_employee_profile: bool
    employee_id: int | None = None
    employee_name: str | None = None
    has_checked_in: bool = False
    has_checked_out: bool = False
    is_checked_in: bool = False
    can_check_in: bool = True
    can_check_out: bool = False
    session_count: int = 0
    check_in: datetime | None = None
    check_out: datetime | None = None
    status: str | None = None
    punch_in_photo: str | None = None
    punch_out_photo: str | None = None


class PunchRequest(BaseModel):
    photo: str | None = None


class AttendanceDailyRosterResponse(BaseModel):
    date: date
    total_employees: int
    present_count: int
    absent_count: int
    attendance_rate: float
    roster: list[AttendanceRecordResponse]


class AttendanceMarkRequest(BaseModel):
    employee_id: int
    date: date
    status: Literal["present", "absent", "half_day", "late"] = "present"
    check_in: datetime | None = None
    check_out: datetime | None = None
    punch_in_photo: str | None = None
    punch_out_photo: str | None = None


# ─── Leave ────────────────────────────────────────────────────────────────────

class LeaveCreate(BaseModel):
    from_date: date
    to_date: date
    leave_type: Literal["annual", "sick", "casual", "unpaid"] = "annual"
    reason: str


class LeaveResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: str
    department_name: str | None = None
    from_date: date
    to_date: date
    leave_type: str
    reason: str
    status: str
    days_count: int
    applied_on: date | None = None
    admin_comment: str | None = None
    model_config = ConfigDict(from_attributes=True)


class LeaveStatusUpdate(BaseModel):
    status: Literal["approved", "rejected"]
    admin_comment: str | None = None


class LeaveBalanceItem(BaseModel):
    leave_type: str
    label: str
    total_days: int
    used_days: int
    remaining_days: int


class LeaveUserOverviewResponse(BaseModel):
    has_employee_profile: bool
    balances: list[LeaveBalanceItem]
    requests: list[LeaveResponse]


class LeaveAdminOverviewResponse(BaseModel):
    pending_count: int
    approved_this_month: int
    on_leave_today: int
    requests: list[LeaveResponse]