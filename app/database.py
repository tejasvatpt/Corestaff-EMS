from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./ems.db"

engine = create_engine(     #Engine is the connection between your FastAPI app and the database.
    DATABASE_URL, 
    connect_args={"check_same_thread": False} #SQLite allows only the thread that opened the connection to use it.
                                               #FastAPI handles multiple requests, so we disable that restriction
)

SessionLocal = sessionmaker(   #your conversation with the database.
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()   #parent class for all your database models.


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()