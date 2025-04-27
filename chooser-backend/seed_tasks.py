from app.database import SessionLocal
from app import models

tasks = [
    {"text": "Сделай 10 приседаний", "difficulty": "easy"},
    {"text": "Спой песню", "difficulty": "normal"},
    {"text": "Расскажи анекдот", "difficulty": "normal"},
    {"text": "Изобрази животное", "difficulty": "easy"},
    {"text": "Станцуй 10 секунд", "difficulty": "hard"},
    {"text": "Станцуй 10 секунд", "difficulty": "hard"},
]

db = SessionLocal()
for task in tasks:
    db.add(models.Task(**task))
db.commit()
db.close()

print("Задания добавлены в базу")
