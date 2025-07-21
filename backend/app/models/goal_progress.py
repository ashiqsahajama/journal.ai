from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class GoalProgress(Base):
    __tablename__ = "goal_progress"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    progress_note = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    goal = relationship("Goal", backref="progress_updates")
    user = relationship("User", backref="goal_progress")