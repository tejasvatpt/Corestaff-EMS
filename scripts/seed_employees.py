"""Seed script to populate the EMS database with 50 realistic employee records,
linked user accounts, departments, and attendance records for today.
"""

import os
import sys
import random
from datetime import date, datetime, timedelta

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import Base, SessionLocal, engine
from app.models import Department, User, Employee, Attendance
from app.utils import hash_password

FIRST_NAMES = [
    "Aarav", "Priya", "Alexander", "Sophia", "Liam", "Emma", "Noah", "Olivia",
    "Rohan", "Ananya", "Ethan", "Ava", "Lucas", "Isabella", "Aditya", "Ishita",
    "Mason", "Mia", "Oliver", "Harper", "Kabir", "Diya", "Elijah", "Evelyn",
    "James", "Abigail", "Benjamin", "Emily", "Dev", "Neha", "Sebastian", "Ella",
    "Jack", "Scarlett", "Arjun", "Kavya", "Daniel", "Chloe", "Henry", "Victoria",
    "Siddharth", "Tanvi", "Owen", "Grace", "Jackson", "Zoey", "Vihaan", "Meera",
    "Mateo", "Penelope", "Vivaan", "Riya"
]

LAST_NAMES = [
    "Sharma", "Patel", "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller",
    "Verma", "Gupta", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Iyer", "Rao", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
    "Reddy", "Nair", "Martin", "Lee", "Perez", "Thompson", "White", "Harris",
    "Chopra", "Malhotra", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Kapoor", "Bhatia", "Young", "Allen", "King", "Wright", "Scott", "Torres",
    "Mehta", "Saxena"
]

DEPARTMENTS_CONFIG = [
    {
        "name": "Engineering",
        "designations": [
            "Senior Backend Engineer", "Frontend Developer", "Full Stack Engineer",
            "DevOps & Cloud Engineer", "QA Automation Engineer", "Tech Lead",
            "Staff Software Engineer", "Mobile App Developer"
        ],
    },
    {
        "name": "Product & Design",
        "designations": [
            "Lead Product Manager", "UI/UX Designer", "Product Designer",
            "Technical Product Manager", "Design Systems Lead"
        ],
    },
    {
        "name": "Marketing",
        "designations": [
            "Growth Marketing Lead", "Content Strategist", "SEO Specialist",
            "Brand Manager", "Performance Marketer"
        ],
    },
    {
        "name": "HR & People",
        "designations": [
            "HR Business Partner", "Talent Acquisition Lead", "HR Operations Specialist",
            "People & Culture Lead"
        ],
    },
    {
        "name": "Sales & Growth",
        "designations": [
            "Account Executive", "Business Development Rep", "Enterprise Sales Lead",
            "Sales Operations Analyst"
        ],
    },
    {
        "name": "Finance & Operations",
        "designations": [
            "Financial Analyst", "Operations Manager", "Accounting Lead",
            "Billing Specialist"
        ],
    },
    {
        "name": "Customer Success",
        "designations": [
            "Customer Success Manager", "Support Operations Lead", "Client Solutions Engineer"
        ],
    },
]


def seed():
    print(f"Connecting to database at {os.path.abspath('ems.db')}...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Ensure departments exist
        dept_records = []
        for dept_info in DEPARTMENTS_CONFIG:
            existing = db.query(Department).filter(Department.name.ilike(dept_info["name"])).first()
            if not existing:
                dept = Department(name=dept_info["name"])
                db.add(dept)
                db.commit()
                db.refresh(dept)
                dept_records.append(dept)
            else:
                dept_records.append(existing)

        print(f"Ensured {len(dept_records)} active departments.")

        # 2. Get existing user emails to avoid duplicates
        existing_emails = set(row[0] for row in db.query(User.email).all())
        existing_usernames = set(row[0] for row in db.query(User.username).all())

        common_password_hash = hash_password("Password123!")

        created_employees = 0
        target_count = 50

        random.shuffle(FIRST_NAMES)
        random.shuffle(LAST_NAMES)

        name_pairs = []
        for fn in FIRST_NAMES:
            for ln in LAST_NAMES:
                name_pairs.append((fn, ln))
        random.shuffle(name_pairs)

        pair_idx = 0
        today = date.today()

        while created_employees < target_count and pair_idx < len(name_pairs):
            fn, ln = name_pairs[pair_idx]
            pair_idx += 1

            full_name = f"{fn} {ln}"
            clean_username = f"{fn.lower()}.{ln.lower()}{random.randint(10, 999)}"
            email = f"{fn.lower()}.{ln.lower()}{random.randint(10, 999)}@ems.corp"

            if email in existing_emails or clean_username in existing_usernames:
                continue

            existing_emails.add(email)
            existing_usernames.add(clean_username)

            # Create User
            user = User(
                username=clean_username,
                email=email,
                password_hash=common_password_hash,
                role="employee",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Pick department and designation
            dept = random.choice(dept_records)
            config = next(d for d in DEPARTMENTS_CONFIG if d["name"] == dept.name)
            designation = random.choice(config["designations"])

            # Random phone
            phone = f"+1 ({random.randint(200, 999)}) {random.randint(200, 999)}-{random.randint(1000, 9999)}"

            # Random joining date within past 3 years
            days_ago = random.randint(15, 1000)
            joining_date = today - timedelta(days=days_ago)

            employee = Employee(
                user_id=user.id,
                department_id=dept.id,
                full_name=full_name,
                designation=designation,
                phone=phone,
                joining_date=joining_date,
            )
            db.add(employee)
            db.commit()
            db.refresh(employee)

            # Seed attendance for today for ~75% of employees
            should_be_present = random.random() < 0.75
            if should_be_present:
                hour = random.randint(8, 10)
                minute = random.randint(0, 59)
                check_in_time = datetime(today.year, today.month, today.day, hour, minute, random.randint(0, 59))

                # Some have already checked out
                has_checked_out = random.random() < 0.4
                check_out_time = None
                if has_checked_out:
                    out_hour = random.randint(16, 19)
                    check_out_time = datetime(today.year, today.month, today.day, out_hour, random.randint(0, 59), random.randint(0, 59))

                status = "late" if hour >= 10 else "present"

                att = Attendance(
                    employee_id=employee.id,
                    date=today,
                    check_in=check_in_time,
                    check_out=check_out_time,
                    status=status,
                )
                db.add(att)
                db.commit()

            created_employees += 1

        print(f"Successfully generated {created_employees} new employees with linked user accounts and today's attendance logs!")

        # Summary
        total_emp = db.query(Employee).count()
        total_users = db.query(User).count()
        total_depts = db.query(Department).count()
        print(f"Current DB totals -> Employees: {total_emp}, Users: {total_users}, Departments: {total_depts}")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
