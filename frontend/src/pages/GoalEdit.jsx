import { useEffect, useState } from "react";
import { getAllGoalProgress, deleteGoal, updateGoal } from "../services/goals";

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div
      className={`p-3 rounded-md mb-4 text-center text-sm font-medium ${
        type === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {message}
    </div>
  );
}

function GoalEdit() {
  const [goals, setGoals] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loadingGoalId, setLoadingGoalId] = useState(null); // For disabling buttons during action

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await getAllGoalProgress();
        setGoals(res.data);
      } catch (err) {
        setToastMessage("Failed to load goals.");
        setToastType("error");
      }
    };

    fetchGoals();
  }, []);

  const handleEditGoal = async (goalId) => {
    const currentGoal = goals.find((g) => g.id === goalId);
    if (!currentGoal) return;

    try {
      setLoadingGoalId(goalId);
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
      setToastMessage("Goal updated successfully.");
      setToastType("success");
    } catch (error) {
      setToastMessage("Failed to update goal.");
      setToastType("error");
    } finally {
      setLoadingGoalId(null);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      setLoadingGoalId(goalId);
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      setToastMessage("Goal deleted.");
      setToastType("success");
    } catch (err) {
      setToastMessage("Failed to delete goal.");
      setToastType("error");
    } finally {
      setLoadingGoalId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          📝 Manage Your Goals
        </h2>

        <Toast message={toastMessage} type={toastType} />

        <div className="space-y-6">
          {goals.length === 0 && (
            <p className="text-center text-gray-500">No goals found.</p>
          )}

          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-lg border border-gray-200 shadow-sm bg-gray-50 hover:shadow-md transition"
            >
              {isEditing === goal.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditGoal(goal.id)}
                      disabled={loadingGoalId === goal.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loadingGoalId === goal.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(null);
                        setEditText("");
                      }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="text-gray-800 font-medium">{goal.goal_text}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsEditing(goal.id);
                        setEditText(goal.goal_text);
                      }}
                      className="text-sm text-yellow-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      disabled={loadingGoalId === goal.id}
                      className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      {loadingGoalId === goal.id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GoalEdit;
