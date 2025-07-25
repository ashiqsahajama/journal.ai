import { useState } from "react";
import { useNavigate } from "react-router-dom";  // For navigation after goal submission
import { postMonthlyGoal } from "../services/goals";  

function SetGoals() {
  const [goals, setGoals] = useState([{ goal_text: "", month: "" }]);  // Store multiple goals
  const [errorMessage, setErrorMessage] = useState("");  // For error messages
  const [isLoading, setIsLoading] = useState(false);  // For loading state
  const navigate = useNavigate();  // Use navigate to go to another page after success

  // Handle goal input change
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  // Add a new goal
  const addGoal = () => {
    setGoals([...goals, { goal_text: "", month: "" }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Filter out any empty goals
    const validGoals = goals.filter(goal => goal.goal_text && goal.month);

    if (validGoals.length === 0) {
      setErrorMessage("Please fill in at least one goal.");
      return;
    }

    setIsLoading(true); // Start loading spinner
    setErrorMessage("");  // Clear any previous error messages

    try {
      for (const goal of validGoals) {
        // console.log(goal);
        await postMonthlyGoal(goal);  // Submit each goal individually
      }
      alert("Goals submitted successfully!");  // Success message after submission
      navigate("/goal-progress");  // Redirect to Goal Progress page after success
    } catch (error) {
      setErrorMessage("There was an issue submitting your goals.");
      console.error("Error submitting goals", error);
    } finally {
      setIsLoading(false);  // End loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 mt-2">Set Your Goals</h2>

        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        {/* Render each goal input */}
        {goals.map((goal, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Enter Your Goal"
              className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
              value={goal.goal_text}
              onChange={(e) => handleGoalChange(index, "goal_text", e.target.value)}
              required
            />
            <input
              type="month"
              className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
              value={goal.month}
              onChange={(e) => handleGoalChange(index, "month", e.target.value)}
              required
            />
          </div>
        ))}

        {/* Add New Goal Button */}
        <button
          type="button"
          onClick={addGoal}
          className="bg-gray-500 text-white py-2 px-4 rounded mb-4"
        >
          Add Another Goal
        </button>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={isLoading}  // Disable button while loading
        >
          {isLoading ? "Submitting..." : "Set Goals"}
        </button>
      </div>
    </div>
  );
}

export default SetGoals;
