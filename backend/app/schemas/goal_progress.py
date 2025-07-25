from pydantic import BaseModel
from datetime import date

class GoalProgressCreate(BaseModel):
    goal_id: int
    progress_date: date
    status: bool

class GoalProgressOut(GoalProgressCreate):
    id: int
    user_id: int
    

    class Config:
        orm_mode = True