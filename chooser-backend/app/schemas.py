from pydantic import BaseModel

class TaskBase(BaseModel):
    text: str
    difficulty: str

class TaskCreate(TaskBase):
    pass

class TaskOut(TaskBase):
    id: int

    class Config:
        from_attributes  = True
