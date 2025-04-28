from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import random
import os
from openai import OpenAI

from app.models import Task
from app.schemas import TaskOut
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/task/random", response_model=TaskOut)
def get_random_task(difficulty: str = Query("normal"), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.difficulty == difficulty).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="Заданий не найдено")
    return random.choice(tasks)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.get("/task/ai")
async def get_ai_task(difficulty: str = "normal"):
    try:
        difficulty_prompt = {
            "easy": "для детей(легкое)",
            "normal": "для вечеринки(среднее)",
            "hard": "очень смелое или странное(сложное)"
        }.get(difficulty, "для вечеринки")

        prompt = f"Придумай короткое, весёлое задание {difficulty_prompt}, которое можно выполнить за 1 минуту. Только само задание, без пояснений."

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Ты генератор весёлых заданий для игры"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.9,
            max_tokens=60
        )

        task = response.choices[0].message.content.strip()
        return { "task": task }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
