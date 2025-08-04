from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.journal_entry import JournalEntryCreate, JournalEntryOut, JournalEntryUpdate
from app.models.journal_entry import JournalEntry
from app.utils.auth import get_current_user
from app.models.user import User
from typing import List
from datetime import date
from sqlalchemy import func

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

# GET /entries/today - gets If today’s journal entry exists, return it;
@router.get("/today", response_model=JournalEntryOut)
def get_today_journal(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = date.today()
    
    journal = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        func.date(JournalEntry.created_at) == today
    ).first()

    if journal: return journal
        
    raise HTTPException(
        status_code=status.HTTP_204_NO_CONTENT,
        detail="No journal entry for today"
    )

# PUT /entries/{entry_id} - updates the entry for a given entry_id
@router.put("/{entry_id}", response_model=JournalEntryOut)
def update_journal_entry(
    entry_id: int, 
    updated_data: JournalEntryUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    journal_entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not journal_entry: raise HTTPException(status_code=404, detail="Journal entry not found")
    if journal_entry.user_id != current_user.id: raise HTTPException(status_code=403, detail="Not authorized to update this journal entry")
    journal_entry.text = updated_data.text
    journal_entry.rating = updated_data.rating
    journal_entry.mood_tag = updated_data.mood_tag

    db.commit()
    db.refresh(journal_entry)

    return journal_entry