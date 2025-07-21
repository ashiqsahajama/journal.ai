from fastapi import APIRouter, HTTPException, Depends
from app.schemas.goal_progress import GoalProgressCreate, GoalProgressOut
from app.database import get_db
from sqlalchemy.orm import Session
from app.utils.auth import User, get_current_user
from app.models.goal_progress import GoalProgress
from app.models.goal import Goal


router = APIRouter(prefix="/goal-progress", tags=["Goal Progress"])

@router.post("/", response_model=GoalProgressOut)
def create_goal_progress(progress:GoalProgressCreate, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id==progress.goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found for this user")
    
    new_progress = GoalProgress(
        goal_id = progress.goal_id,
        user_id = current_user.id,
        progress_note = progress.progress_note
    )

    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress