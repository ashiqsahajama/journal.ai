import { useState, useEffect } from "react";
import {
  getAllGoalProgress,
  getGoalProgress,
  postGoalProgress,
  deleteGoal,
  updateGoal,
} from "../services/goals";
import { useNavigate } from "react-router-dom";
import GoalAnalyticsModal from "./GoalAnalyticsModal";

// Toast UI component
function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div
      className={`p-3 text-white rounded-md mb-4 text-center transition duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}

function GoalProgress() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  const formatDate = (date) => date.toISOString().split("T")[0];
  const today = formatDate(new Date()); // Use current day
  //const today = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // hardcoded to tomorrow

  useEffect(() => {
    const fetchGoalsWithProgress = async () => {
      try {
        const response = await getAllGoalProgress();
        const allGoals = response.data;

        const enrichedGoals = await Promise.all(
          allGoals.map(async (goal) => {
            const createdAt = formatDate(new Date(goal.created_at));

            if (createdAt > today) {
              return {
                ...goal,
                todayStatus: "not_started",
              };
            }

            try {
              const progressRes = await getGoalProgress(goal.id);
              const progressEntries = progressRes.data;

              const todayProgress = progressEntries.find(
                (entry) => entry.progress_date === today
              );

              return {
                ...goal,
                todayStatus:
                  todayProgress !== undefined
                    ? todayProgress.status
                    : undefined,
              };
            } catch (err) {
              console.error(`Error fetching progress for goal ${goal.id}`, err);
              return { ...goal, todayStatus: undefined };
            }
          })
        );

        const visibleGoals = enrichedGoals.filter(
          (g) => g.todayStatus !== "not_started"
        );
        setGoals(visibleGoals);
      } catch (error) {
        console.error("Error fetching goals", error);
        setToastMessage("Failed to load goals.");
        setToastType("error");
      }
    };

    fetchGoalsWithProgress();
  }, []);

  const handleProgressSubmit = async (goalId, dailyProgress) => {
    if (!dailyProgress) {
      setToastMessage("Please select Yes or No for today's progress.");
      setToastType("error");
      return;
    }

    setIsLoading(true);
    try {
      const progressData = {
        goal_id: goalId,
        progress_date: today,
        status: dailyProgress === "Yes",
      };

      await postGoalProgress(progressData);

      setToastMessage("Progress updated successfully!");
      setToastType("success");

      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId ? { ...g, todayStatus: dailyProgress === "Yes" } : g
        )
      );
    } catch (error) {
      console.error("Error updating progress", error?.response?.data || error);
      setToastMessage("Error updating progress.");
      setToastType("error");
    } finally {
      setTimeout(() => setToastMessage(""), 3000);
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter((g) => g.id !== goalId));
      setToastMessage("Goal deleted.");
      setToastType("success");
    } catch (error) {
      setToastMessage("Failed to delete goal");
      setToastType("error");
    }
  };

  const handleEditGoal = async (goalId) => {
    const currentGoal = goals.find((g) => g.id === goalId);
    if (!currentGoal) return;
  
    try {
      await updateGoal(goalId, {
        goal_text: editText,
        month: currentGoal.month,
      });
  
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId ? { ...g, goal_text: editText } : g
        )
      );
      setIsEditing(null);
      setEditText("");
      setToastMessage("Goal updated.");
      setToastType("success");
    } catch (error) {
      setToastMessage("Failed to update goal.");
      setToastType("error");
    }
  };
  

  const completedCount = goals.filter((g) => g.todayStatus === true).length;
  const notCompletedCount = goals.filter((g) => g.todayStatus === false).length;
  const pendingCount = goals.filter((g) => g.todayStatus === undefined).length;
  const totalWithStatus =
    completedCount + notCompletedCount + pendingCount;
  const completionRate =
    totalWithStatus === 0
      ? 0
      : Math.round((completedCount / totalWithStatus) * 100);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🏁 Track Your Daily Goals
        </h3>

        <div className="mb-8 px-4 py-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-xl font-semibold text-center text-gray-800 mb-4">
            📈 Today's Summary
          </h4>

          <div className="flex justify-center gap-6 text-base font-medium text-gray-700 mb-4">
            <span>
              ✅{" "}
              <span className="text-green-600 font-bold">
                {completedCount}
              </span>{" "}
              Completed
            </span>
            <span>
              ❌{" "}
              <span className="text-red-600 font-bold">
                {notCompletedCount}
              </span>{" "}
              Not Completed
            </span>
            <span>
              ⏳{" "}
              <span className="text-yellow-500 font-bold">
                {pendingCount}
              </span>{" "}
              Pending
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>

          <p className="text-sm text-center text-gray-600 mt-2">
            Progress: <span className="font-semibold">{completionRate}%</span>
          </p>
        </div>

        <Toast message={toastMessage} type={toastType} />

        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`mb-6 p-5 rounded-lg border transition-all duration-200 ${
              goal.todayStatus === true
                ? "bg-green-50 border-green-200"
                : goal.todayStatus === false
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              {isEditing === goal.id ? (
                <div className="flex flex-col w-full mb-2">
                  <input
                    type="text"
                    className="border p-3 rounded text-md"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleEditGoal(goal.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded text-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(null);
                        setEditText("");
                      }}
                      className="bg-gray-300 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {goal.goal_text}
                  </h4>
                  <button
                    onClick={() => setSelectedGoal(goal)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    📊 View Chart
                  </button>
                </>
              )}
            </div>

            {goal.todayStatus !== undefined && (
              <p
                className={`text-sm font-medium mb-3 ${
                  goal.todayStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                Today's status:{" "}
                {goal.todayStatus ? "Completed ✅" : "Not Completed ❌"}
              </p>
            )}

            {goal.todayStatus === undefined && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleProgressSubmit(goal.id, "Yes")}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition"
                >
                  ✅ Yes
                </button>
                <button
                  onClick={() => handleProgressSubmit(goal.id, "No")}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                >
                  ❌ No
                </button>
              </div>
            )}

            {isEditing !== goal.id && (
              <div className="flex items-center justify-end gap-4 mt-3">
                <button
                  onClick={() => {
                    setIsEditing(goal.id);
                    setEditText(goal.goal_text);
                  }}
                  className="text-yellow-600 text-sm hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedGoal && (
        <GoalAnalyticsModal
          goalId={selectedGoal.id}
          goalText={selectedGoal.goal_text}
          onClose={() => setSelectedGoal(null)}
        />
      )}
    </div>
  );
}

export default GoalProgress;
