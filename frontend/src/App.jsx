import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SetGoals from './pages/SetGoals';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import GoalProgress from './pages/GoalProgress';
import PrivateRoute from './pages/PrivateRoute'; // ✅ make sure this is the correct path
import './App.css';

function App() {
  return (
    <div id="navbar">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setgoals" element={<SetGoals />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/progress" element={<GoalProgress />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
