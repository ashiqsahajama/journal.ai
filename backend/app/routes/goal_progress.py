from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import date
from app.schemas.goal_progress import GoalProgressCreate, GoalProgressOut, GoalProgressUpdate
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.utils.auth import User, get_current_user
from app.models.goal_progress import GoalProgress
from app.models.goal import Goal
from app.models.journal_entry import JournalEntry
from typing import List
from sqlalchemy import cast, Date
from collections import defaultdict

router = APIRouter(prefix="/goal-progress", tags=["Goal Progress"])

# Post daily goal progress
@router.post("/", response_model=GoalProgressOut)
def create_goal_progress(progress:GoalProgressCreate, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    # Check if the goal exists for current user or nor
    goal = db.query(Goal).filter(Goal.id==progress.goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found for this user")
    
    # Create new goal_progress
    new_progress = GoalProgress(
        goal_id = progress.goal_id,
        user_id = current_user.id,
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

# Get route for getting all progresses for a goal
@router.get("/{goal_id}", response_model=List[GoalProgressOut])
def get_goal_progress(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        # Suggestion: In front-end, let user choose goal when they want to display what goal_progress they want to see
        raise HTTPException(status_code=404, detail="Goal not found or not accessible")
    
    progress_entries = db.query(GoalProgress).filter(GoalProgress.goal_id == goal.id, GoalProgress.user_id == current_user.id
    ).order_by(GoalProgress.progress_date.asc()).all()

    return progress_entries

 # Get route for all goals progresses for a given date
@router.get("/by-date")
def get_goal_progress_by_date(
    date: date = Query(..., example="2025-07-20"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_goals = db.query(Goal).filter(Goal.user_id == current_user).all()
    result = {}
    for goal in user_goals:
        progress = db.query(GoalProgress).filter(
            GoalProgress.goal_id == goal.id,
            GoalProgress.progress_date == date
        ).first()
        result[goal.id] = {
            "goal_text": goal.goal_text,
            "status": progress.status if progress else False # Not sure why False, CHECK IN FUTURE
        }
    return result

 # Get route for all goals progresses for all dates in date:{goal_id: {goal_text, status}}
@router.get("/all-by-date")
def get_all_goal_progress_grouped_by_date(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    progress_records = db.query(GoalProgress).join(Goal).filter(
        GoalProgress.user_id == current_user.id
    ).all()

    grouped = defaultdict(dict)

    for record in progress_records:
        goal_id = record.goal_id
        goal_text = record.goal.goal_text
        progress_date = record.progress_date.isoformat()
        grouped[progress_date][goal_id] = { "goal_text": goal_text, "status": record.status }    
    return grouped

# Put route for updating goal progress
@router.put("/{goal_progress_id}")
def update_goal_progress(
    goal_progress_id: int,
    update_data: GoalProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal_progress = db.query(GoalProgress).filter(GoalProgress.id == goal_progress_id).first()

    if not goal_progress: raise HTTPException(status_code=404, detail="Goal Progress not found")
    if goal_progress.user_id != current_user.id: raise HTTPException(status_code=403, detail="Not authorized to edit this progress")

    goal_progress.status = update_data.status

    db.commit()
    db.refresh(goal_progress)

    return {
        "message":"Goal Progress updated successfully!",
        "progress_id": goal_progress.id,
        "status": goal_progress.status
    }