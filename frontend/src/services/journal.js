import api from "./api";

export const postJournalEntry = (entry) =>
  api.post("/entries", entry); // Make sure the backend has a /entries POST endpoint
