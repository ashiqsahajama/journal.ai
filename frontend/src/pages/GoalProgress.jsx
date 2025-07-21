import { useState } from "react";
import { postGoalProgress } from "../services/goals"; 

function GoalProgress({ goal }) {
  const [status, setStatus] = useState("Missed");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalProgressData = {
      goal_id: goal.id,
      status,
      user_id: goal.user_id,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await postGoalProgress(goalProgressData); 
      console.log("Goal progress saved:", response.data);
    } catch (error) {
      console.error("Error saving goal progress", error);
    }
  };

  return (
    <div className="goal-progress-form">
      <h3>{goal.goal_text}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="status"
            value="Completed"
            checked={status === "Completed"}
            onChange={() => setStatus("Completed")}
          />
          Completed
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="Missed"
            checked={status === "Missed"}
            onChange={() => setStatus("Missed")}
          />
          Missed
        </label>
        <button type="submit">Save Progress</button>
      </form>
    </div>
  );
}

export default GoalProgress;
