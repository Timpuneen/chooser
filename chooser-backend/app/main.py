from fastapi import FastAPI
from routes import tasks
from . import models
from .database import engine
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#models.Base.metadata.create_all(bind=engine)

app.include_router(tasks.router)
