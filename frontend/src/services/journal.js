import api from "./api";

export const postJournalEntry = (entry) =>
  api.post("/entries", entry); 


export const updateJournalEntry = (id, entry) =>
  api.put(`/entries/${id}`, entry);

export const getTodayEntry = ()=>
    api.get("/entries/today");