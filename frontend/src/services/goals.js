import api from "./api";

export const postMonthlyGoal = (goalData) => api.post("/goals", goalData);

export const getMonthlyGoals = () => api.get("/goals");

// Post daily progress for a goal
export const postGoalProgress = (goalProgressData) => {
  return api.post("/goal-progress", goalProgressData);
};

// Get all progress for a specific goal
export const getGoalProgress = (goalId) => {
  return api.get(`/goal-progress/${goalId}`);
};

export const getAllGoalProgress = () => {
  return api.get('/goals');
};
