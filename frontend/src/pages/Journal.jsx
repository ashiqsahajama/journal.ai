import React, { useState } from 'react';
import { postJournalEntry } from '../services/journal';

function Journal() {
    const [journalText, setJournalText] = useState("");
    const [rating, setRating] = useState(5);
    const [mood_tag, setMood] = useState("neutral");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackMessageType, setFeedbackMessageType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedbackMessage("");
        setFeedbackMessageType("");

        const journalEntry = {
            text: journalText,
            rating: parseInt(rating),
            mood_tag
        };

        try {
            const response = await postJournalEntry(journalEntry);
            console.log("Journal entry saved:", response.data);
            setFeedbackMessage("Journal entry saved successfully!");
            setFeedbackMessageType("success");
            setJournalText("");
            setRating(5);
            setMood("neutral");
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">New Entry</h2>
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
                        Save Entry
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Yesterday's Entry</h2>
                    <div id="journal-entries-display" className="space-y-4">
                        <div className="bg-blue-50 p-4 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-600 mb-2">July 16</p>
                            <p className="text-gray-800">
                                Today was a productive day. I managed to finish the Tailwind CSS UI for the journal page.
                                Feeling good about the progress!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Journal;
