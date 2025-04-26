from fastapi import FastAPI
from .routes import tasks
from . import models
from .database import engine

app = FastAPI()

# Создаём таблицы
models.Base.metadata.create_all(bind=engine)

# Подключаем роутер
app.include_router(tasks.router)
