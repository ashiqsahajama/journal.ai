import { useState, useEffect } from "react";
import { getGoalProgress, postGoalProgress } from "../services/goals"; // Import goal progress services
import { useNavigate } from "react-router-dom"; // For navigation

function GoalProgress() {
  const [goals, setGoals] = useState([]);  // Store goals data
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Toast notification state
  const navigate = useNavigate(); // Navigation after goal update

  // Fetch all goals when component mounts
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await getGoalProgress();  // Fetch progress data for all goals
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals", error);
      }
    };
    fetchGoals();
  }, []);

  // Submit goal progress (Yes/No for each goal)
  const handleProgressSubmit = async (goalId, dailyProgress) => {
    if (!dailyProgress) {
      alert("Please select Yes or No for today's progress.");
      return;
    }

    setIsLoading(true);
    try {
      const progressData = {
        goal_id: goalId,
        progress_date: new Date().toISOString().slice(0, 10),  // Current date (YYYY-MM-DD)
        progress: dailyProgress,  // User's progress input (Yes or No)
      };

      await postGoalProgress(progressData);  // Submit progress data to backend
      setToastMessage("Progress updated successfully!");  // Show success toast
      setTimeout(() => setToastMessage(""), 3000);  // Hide toast after 3 seconds

      // Fetch updated progress
      const response = await getGoalProgress();
      setGoals(response.data);  // Update progress history
    } catch (error) {
      setToastMessage("Error updating progress.");  // Show error toast
      console.error("Error updating progress", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Your Goals</h3>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-green-500 text-white p-2 rounded-md mb-4 text-center">
          {toastMessage}
        </div>
      )}

      {/* Loop through all goals */}
      {goals.map((goal) => (
        <div key={goal.goal_id} className="mb-6">
          <h4 className="text-lg font-semibold mb-2">{goal.goal_text}</h4>

          {/* Progress Bar (optional) */}
          <div className="w-full h-2 bg-gray-200 rounded-lg mb-4">
            {/* Progress bar logic if needed */}
          </div>

          {/* Daily Progress Input - Yes/No */}
          <div className="mb-4">
            <p className="font-semibold text-lg">Did you complete your goal today?</p>
            <div className="flex justify-between mt-2">
              <button
                className="w-full bg-green-500 text-white py-2 rounded-md mr-2 mb-2 hover:bg-green-600"
                onClick={() => handleProgressSubmit(goal.goal_id, "Yes")}
                disabled={isLoading}
              >
                Yes
              </button>
              <button
                className="w-full bg-red-500 text-white py-2 rounded-md ml-2 mb-2 hover:bg-red-600"
                onClick={() => handleProgressSubmit(goal.goal_id, "No")}
                disabled={isLoading}
              >
                No
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Submit Progress Button */}
      <div>
        <button
          className={`w-full p-2 text-white rounded-md mb-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Progress"}
        </button>
      </div>
    </div>
  );
}

export default GoalProgress;
