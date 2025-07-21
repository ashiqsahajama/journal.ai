from pydantic import BaseModel
from datetime import datetime

class GoalBase(BaseModel):
    goal_text: str
    target: str
    month: str  # e.g. "2025-07"

class GoalCreate(GoalBase):
    pass

class GoalOut(GoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
