from sqlalchemy import Column, Integer, String
from app import database

class Task(database.Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
