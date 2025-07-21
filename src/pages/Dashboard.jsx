import { useEffect, useState } from "react";
import { getMonthlyGoals } from "../services/goals"; // Fetch monthly goals from the backend
import GoalProgress from "./GoalProgress"; // Import the GoalProgress form

function Dashboard() {
  const [goals, setGoals] = useState([]);

  // Fetch the user's goals from the backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await getMonthlyGoals(); // Call the API to fetch goals
        setGoals(response.data.goals); // Set goals into state
      } catch (error) {
        console.error("Error fetching goals", error);
      }
    };

    fetchGoals();  // Fetch goals when the component is mounted
  }, []);

  return (
    <div className="goal-summary">
      <h2>Your Monthly Goals</h2>
      {goals.map((goal) => (
        <div key={goal.id} className="goal-item">
          <p><strong>Goal:</strong> {goal.goal_text}</p>
          <p><strong>Target:</strong> {goal.target}</p>
          <p><strong>Status:</strong> {goal.status}</p>
          {/* Here, we display the GoalProgress form for each goal */}
          <GoalProgress goal={goal} />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
