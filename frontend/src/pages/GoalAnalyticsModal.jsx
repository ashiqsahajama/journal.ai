import { useEffect, useState } from "react";
import { getGoalProgress } from "../services/goals";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Pie chart modules
ChartJS.register(ArcElement, Tooltip, Legend);

export default function GoalAnalyticsModal({ goalId, goalText, onClose }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await getGoalProgress(goalId);
        setProgress(res.data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [goalId]);

  const completed = progress.filter((e) => e.status === true);
  const missed = progress.filter((e) => e.status === false);
  const total = progress.length;
  const completionRate = total ? Math.round((completed.length / total) * 100) : 0;

  // Streak logic (simplified)
  let streak = 0;
  for (let i = progress.length - 1; i >= 0; i--) {
    if (progress[i].status) streak++;
    else break;
  }

  const lastCompleted =
    completed.length > 0
      ? completed[completed.length - 1].progress_date
      : "Never";

  const pieData = {
    labels: ["✅ Completed", "❌ Missed"],
    datasets: [
      {
        data: [completed.length, missed.length],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📊 {goalText}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
            <div>
              <Pie data={pieData} />
            </div>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p>✅ Completed: <strong>{completed.length}</strong></p>
              <p>❌ Missed: <strong>{missed.length}</strong></p>
              <p>📈 Completion Rate: <strong>{completionRate}%</strong></p>
              <p>🔥 Current Streak: <strong>{streak}</strong> day(s)</p>
              <p>🕒 Last Completed: <strong>{lastCompleted}</strong></p>
              <p>📊 Total Days: <strong>{total}</strong></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
