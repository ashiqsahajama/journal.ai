import { useState } from 'react'
import {Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import {Navigate} from 'react-router-dom';
import Register from './pages/Register';
import SetGoals from './pages/SetGoals';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import './App.css'

function App() {
  return (
    <div id="navbar">
      <Routes>
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/journal" element={<Journal/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/setgoals" element={<SetGoals/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
    </div>
  )
}

export default App
