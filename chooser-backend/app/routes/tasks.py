from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import random

from .. import models, schemas
from ..database import SessionLocal

router = APIRouter()

# Зависимость для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/task/random", response_model=schemas.TaskOut)
def get_random_task(difficulty: str = Query("normal"), db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.difficulty == difficulty).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="Заданий не найдено")
    return random.choice(tasks)
