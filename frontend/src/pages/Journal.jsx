import React, { useState, useEffect } from 'react';
import {
  postJournalEntry,
  updateJournalEntry,
  getTodayEntry,
//   getYesterdayEntry,
} from '../services/journal';

function Journal() {
  const [journalText, setJournalText] = useState("");
  const [rating, setRating] = useState(5);
  const [mood_tag, setMood] = useState("neutral");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackMessageType, setFeedbackMessageType] = useState("");
  const [existingEntryId, setExistingEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todaysEntry, setTodaysEntry] = useState(null);
  const [yesterdaysEntry, setYesterdaysEntry] = useState(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const todayRes = await getTodayEntry();
        setTodaysEntry(todayRes.data);
      } catch (error) {
        if (error.response?.status !== 204) {
          console.error("Failed to fetch today's entry:", error);
        }
      }

      try {
        const yestRes = await getYesterdayEntry();
        setYesterdaysEntry(yestRes.data);
      } catch (error) {
        if (error.response?.status !== 204) {
          console.error("Failed to fetch yesterday's entry:", error);
        }
      }

      setLoading(false);
    };

    loadEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage("");
    setFeedbackMessageType("");

    const journalEntry = {
      text: journalText,
      rating: parseInt(rating),
      mood_tag,
    };

    try {
      let response;
      if (existingEntryId) {
        response = await updateJournalEntry(existingEntryId, journalEntry);
        setFeedbackMessage("Journal entry updated successfully!");
      } else {
        response = await postJournalEntry(journalEntry);
        setFeedbackMessage("Journal entry saved successfully!");
      }

      setFeedbackMessageType("success");
      setExistingEntryId(null);
      setJournalText("");
      setRating(5);
      setMood("neutral");
      setTodaysEntry(response.data);
    } catch (error) {
      console.error("Error saving journal entry", error);
      setFeedbackMessage(
        error.response?.data?.message || "Failed to save journal entry. Please try again."
      );
      setFeedbackMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          My Daily Journal
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading entries...</p>
        ) : (
          <>
            {feedbackMessage && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  feedbackMessageType === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {feedbackMessage}
              </div>
            )}

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {existingEntryId ? "Edit Entry" : "Today's Entry"}
              </h2>

              {/* Show form if editing or no entry yet */}
              {!todaysEntry || existingEntryId ? (
                <>
                  <textarea
                    id="journal-entry"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y min-h-[150px]"
                    placeholder="Write your thoughts here..."
                  ></textarea>

                  <div className="mb-4 mt-6">
                    <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
                      Mood:
                    </label>
                    <select
                      id="mood"
                      value={mood_tag}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                      <option value="happy">Happy 😊</option>
                      <option value="sad">Sad 😔</option>
                      <option value="neutral">Neutral 😐</option>
                      <option value="excited">Excited 🎉</option>
                      <option value="anxious">Anxious 😟</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Rating: <span className="font-semibold text-blue-600">{rating}/10</span>
                    </label>
                    <input
                      type="range"
                      id="rating"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <button
                    className="mt-4 w-full py-3 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    onClick={handleSubmit}
                  >
                    {existingEntryId ? "Update Entry" : "Save Entry"}
                  </button>
                </>
              ) : (
                <div className="bg-blue-50 p-4 border border-blue-200 rounded-md">
                  <p className="text-gray-800 whitespace-pre-line mb-2">{todaysEntry.text}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Mood: {todaysEntry.mood_tag || "Not set"}, Rating: {todaysEntry.rating}/10
                  </p>
                  <button
                    onClick={() => {
                      setJournalText(todaysEntry.text);
                      setMood(todaysEntry.mood_tag || "neutral");
                      setRating(todaysEntry.rating || 5);
                      setExistingEntryId(todaysEntry.id);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit Entry
                  </button>
                </div>
              )}
            </div>

            {yesterdaysEntry && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Yesterday's Entry</h2>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(yesterdaysEntry.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-800 whitespace-pre-line">{yesterdaysEntry.text}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Journal;
