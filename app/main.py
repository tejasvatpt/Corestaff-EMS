from fastapi import FastAPI
from database import engine
from models import Base
from routers.department import router as department_router

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(department_router)


@app.get("/")
def home():
    return {"message": "Hello, World!"}