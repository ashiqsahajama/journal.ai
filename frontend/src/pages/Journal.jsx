import React, { use } from 'react';
import {postJournalEntry} from '../services/journal';
import {useState} from 'react';

function Journal() {
    const [journalText,setJournalText] = useState("");
    const [rating,setRating] = useState(5);
    const [mood,setMood] = useState("neutral");
    const [feedback,setFeedback] = useState("");
    const [feedbackMessage,setFeedbackMessage]= useState("");

    const handleSubmit = async(e)=>{
        e.preventDefault();

        setFeedback("");
        setFeedbackMessage("");
        const journalEntry = {text:journalText,rating:parseInt(rating),mood};

        try {
            // Call the service function to post the journal entry to the backend
            const response = await postJournalEntry(journalEntry);
            console.log("Journal entry saved:", response.data);
      
            // Set success feedback message
            setFeedbackMessage("Journal entry saved successfully!");
            setFeedbackMessageType("success");
      
            // Clear the form fields after successful submission
            setJournalText("");
            setRating(5); // Reset rating to default
            setMood("neutral"); // Reset mood to default
      
          } catch (error) {
            console.error("Error saving journal entry", error);
            // Set error feedback message
            setFeedbackMessage(
              error.response?.data?.message || "Failed to save journal entry. Please try again."
            );
            setFeedbackMessageType("error");
          }
    }

    return (
        // Main container: Uses flexbox to center content horizontally and vertically.
        // min-h-screen ensures it takes at least the full viewport height.
        // bg-gray-100 sets a light background color.
        // p-4 adds some padding around the edges for smaller screens.
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Inner card container for the journal content. */}
            {/* bg-white, p-8, rounded-lg, shadow-xl for styling. */}
            {/* w-full ensures it takes full width up to max-w-2xl. */}
            {/* max-w-2xl sets a maximum width for larger screens for better readability. */}
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                {/* Journal Title */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                    My Daily Journal
                </h1>

                {/* Section for adding a new journal entry */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">New Entry</h2>
                    <textarea
                        id="journal-entry"
                        // w-full for full width, px-4 py-3 for padding inside, border for outline.
                        // rounded-md for rounded corners, focus styles for interaction.
                        // resize-y allows vertical resizing, min-h-[150px] sets a minimum height.
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y min-h-[150px]"
                        placeholder="Write your thoughts here..."
                    ></textarea>
                     <div className="mb-4">
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
            Mood:
          </label>
          <select
            id="mood"
            value={mood}
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
                        // mt-4 for top margin, w-full for full width, py-3 px-4 for padding.
                        // rounded-md for rounded corners, text-white for text color.
                        // font-semibold for bold text, bg-green-600 for background.
                        // hover/focus styles for interactivity, transition for smooth effects.
                        className="mt-4 w-full py-3 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        onClick={handleSubmit}
                    >
                        Save Entry
                    </button>
                </div>

                {/* Section for displaying previous entries */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Yesterday's Entry</h2>
                    <div id="journal-entries-display" className="space-y-4">
                        {/* Placeholder for an individual journal entry */}
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
