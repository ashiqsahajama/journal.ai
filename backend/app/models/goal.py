from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    goal_text = Column(String, nullable=False)
    target = Column(String, nullable=False)
    month = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="goals")