from sqlalchemy import Column, Integer, String,ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Department(Base):
    __tablename__="departments"

    id=Column(Integer, primary_key=True, index=True)
    name= Column(String, unique =True, nullable=False)

    employees= relationship("Employee", back_populates="department")


class User(Base):
    __tablename__="users"

    id=Column(Integer, primary_key=True, index=True)
    username= Column(String, unique=True, nullable =False)
    email= Column(String, unique=True, nullable=False)
    password_hash=Column(String, nullable= False)
    role= Column(String, nullable=False)

    employee=relationship("Employee", back_populates="user",uselist=False)


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))

    full_name = Column(String, nullable=False)
    designation = Column(String)
    phone = Column(String)
    joining_date = Column(Date)

    user = relationship("User", back_populates="employee")
    department = relationship("Department", back_populates="employees")

    attendance = relationship("Attendance", back_populates="employee")
    leaves = relationship("Leave", back_populates="employee")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    date = Column(Date)
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    status = Column(String)

    employee = relationship("Employee", back_populates="attendance")


class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    from_date = Column(Date)
    to_date = Column(Date)
    reason = Column(String)
    status = Column(String)

    employee = relationship("Employee", back_populates="leaves")
    
