from fastapi import APIRouter, HTTPException, Depends
from app.schemas.goal_progress import GoalProgressCreate, GoalProgressOut
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.utils.auth import User, get_current_user
from app.models.goal_progress import GoalProgress
from app.models.goal import Goal
from typing import List


router = APIRouter(prefix="/goal-progress", tags=["Goal Progress"])

@router.post("/", response_model=GoalProgressOut)
def create_goal_progress(progress:GoalProgressCreate, db:Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id==progress.goal_id, Goal.user_id == 1).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found for this user")
    
    new_progress = GoalProgress(
        goal_id = progress.goal_id,
        user_id = 1,
        progress_date = progress.progress_date,
        status = progress.status
    )
    try:
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        return new_progress
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Progress for this data already exists")


@router.get("/{goal_id}", response_model=List[GoalProgressOut])
def get_goal_progress(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == 1).first()
    if not goal:
        # Suggestion: In front-end, let user choose goal when they want to display what goal_progress they want to see
        raise HTTPException(status_code=404, detail="Goal not found or not accessible")
    
    progress_entries = db.query(GoalProgress).filter(GoalProgress.goal_id == goal.id, GoalProgress.user_id == 1
    ).order_by(GoalProgress.progress_date.asc()).all()

    return progress_entries