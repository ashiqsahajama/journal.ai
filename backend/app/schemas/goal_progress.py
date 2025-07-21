from pydantic import BaseModel
from datetime import datetime

class GoalProgressCreate(BaseModel):
    goal_id: int
    progress_note: str

class GoalProgressOut(GoalProgressCreate):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True