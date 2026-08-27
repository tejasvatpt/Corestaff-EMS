from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base

from .routers.department import router as department_router
from .routers.user import router as user_router
from .routers.employee import router as employee_router


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(department_router)
app.include_router(user_router)
app.include_router(employee_router)

@app.get("/")
def home():
    return {"message": "Hello, World!"}

