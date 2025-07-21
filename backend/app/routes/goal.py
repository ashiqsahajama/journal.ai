from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalOut
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.post("/", response_model=GoalOut)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_goal = Goal(
        user_id = current_user.id,
        goal_text = goal.goal_text,
        target = goal.target,
        month = goal.month
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal