from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalOut, GoalBase
from app.utils.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/goals", tags=["Goals"])

# POST - create goal
@router.post("/", response_model=GoalOut)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_goal = Goal(
        user_id = current_user.id,
        goal_text = goal.goal_text,
        month = goal.month
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

# GET - gets all goals for user
@router.get('/', response_model = List[GoalOut])
def get_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.is_deleted == False
    ).order_by(Goal.created_at.asc()).all()

    return goals

@router.put("/{goal_id}")
def update_goal(goal_id: int, new_goal: GoalBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal: raise HTTPException(status_code=404, detail="Goal not found")
    if goal.user_id != current_user.id: raise HTTPException(status_code=403, detail="Not authorized to edit this Goal")

    goal.goal_text = new_goal.goal_text
    goal.month = new_goal.month
    db.commit()
    db.refresh(goal)

    return {
        "message":"Goal updated successfully!",
        "goal_id": goal.id,
        "user_id": goal.user_id
    }

# DELETE - delete a goal
@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    if goal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this goal")

    goal.is_deleted = True
    db.commit()
    return None  # 204 means no content is returned, but just deleted
