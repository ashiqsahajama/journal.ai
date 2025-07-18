from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JournalEntryBase(BaseModel):
    text: str
    rating: Optional[int] = None
    mood_tag: Optional[str] = None

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryOut(JournalEntryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
