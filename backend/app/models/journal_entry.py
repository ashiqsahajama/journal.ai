from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String, nullable=False)
    rating = Column(Integer, nullable=True)
    mood_tag = Column(String, nullable=True)
    created_at = Column(DateTime, default= lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="entries")