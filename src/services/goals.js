import GoalProgress from "../pages/GoalProgress";
import api from "./api";

export const postMonthlyGoal = (goalData) => 
    api.post("/goal",goalData);

export const getMonthlyGoals = () =>
  api.get("/goals"); 

export const postGoalProgress = (GoalProgressData) =>
    api.post("/goal-progres",goalProgressData);