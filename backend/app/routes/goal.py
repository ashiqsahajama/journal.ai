from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalOut
from app.utils.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.post("/", response_model=GoalOut)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    new_goal = Goal(
        user_id = 1,
        goal_text = goal.goal_text,
        month = goal.month
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.get('/', response_model = List[GoalOut])
def get_goals(db: Session = Depends(get_db)):
    goals = db.query(Goal).filter(
        Goal.user_id == 1
    ).order_by(Goal.created_at.asc()).all()

    return goals