from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.journal_entry import JournalEntryCreate, JournalEntryOut
from app.models.journal_entry import JournalEntry
from app.utils.auth import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/entries", tags = ["Entries"])

# POST /entries - create a new journal entry
@router.post("/", response_model=JournalEntryOut)
def create_entry(entry: JournalEntryCreate, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_entry = JournalEntry(
        user_id = current_user.id,
        text = entry.text,
        rating = entry.rating,
        mood_tag=entry.mood_tag
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

# # GET /entries - gets all journal entries for a user
@router.get("/", response_model=List[JournalEntryOut])
def get_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.created_at.desc()).all()
    return entries