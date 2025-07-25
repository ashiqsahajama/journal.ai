from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship 
from datetime import datetime, timezone
from app.database import Base

class GoalProgress(Base):
    __tablename__ = "goal_progress"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    progress_date = Column(Date, nullable=False)
    status = Column(Boolean, nullable=False)

    __table_args__ = (UniqueConstraint('goal_id', 'progress_date', name='unique_goal_date'),)

    goal = relationship("Goal", backref="progress_updates")
    user = relationship("User", backref="goal_progress")