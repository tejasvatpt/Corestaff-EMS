"""Create an admin user, or promote an existing user to admin.

Run from the repo root so the relative sqlite path in app/database.py resolves
to the same ems.db that uvicorn uses:

    env/Scripts/python.exe scripts/create_admin.py --email you@example.com \
        --username you --password yourpassword

If the email already exists, the role is set to "admin" and the password is
only changed when --password is given.
"""

import argparse
import os
import sys

sys.path.insert(
    0,
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from app.database import Base, SessionLocal, engine
from app.models import User
from app.utils import hash_password


def main():
    parser = argparse.ArgumentParser(
        description="Create or promote an admin user."
    )
    parser.add_argument("--email", required=True)
    parser.add_argument("--username")
    parser.add_argument("--password")

    args = parser.parse_args()

    print(f"Database: {os.path.abspath('ems.db')}")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == args.email).first()

        if user:
            user.role = "admin"

            if args.password:
                user.password_hash = hash_password(args.password)

            db.commit()
            db.refresh(user)

            print(
                f"Promoted existing user {user.email} "
                f"(id={user.id}) to admin."
            )
            return

        if not args.username or not args.password:
            parser.error(
                "--username and --password are required to create a new user"
            )

        user = User(
            username=args.username,
            email=args.email,
            password_hash=hash_password(args.password),
            role="admin"
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"Created admin {user.email} (id={user.id}).")

    finally:
        db.close()


if __name__ == "__main__":
    main()
