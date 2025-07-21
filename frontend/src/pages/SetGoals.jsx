import {use, useState} from 'react';
import {postMonthlyGoal } from "../services/goals";

function SetGoals(){
  const [goalText,setGoalText] = useState("");
  const [month,setMonth] = useState("2025-07");
  const [target,setTarget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalData = {
      goal_text:goalText,
      month,
      target,
    };

    try {
      const resonse = await postMonthlyGoal(goalData);
      console.log("Goal saved:",resonse.data);
    } catch(error){
      console.error("Error saving goal",error);
    }
  }

    return(
        <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Enter Monthly Goals</h2>
        <input
          type="text"
          placeholder="Enter goal for the month"
          className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
          value ={goalText}
          onChange = {(e)=> setGoalText(e.target.value)}
          required
        />
        <input type ="text" placeholder='Goal target' className='w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring'
        value ={target}
        onChange ={(e)=> setTarget(e.target.value)}
        required
        />
        <div className="mb-4 flex space-x-4">
        <label htmlFor="month" className='block mb-2'>Select Month</label>
        <select id="month" value={month} onChange = {(e)=> setMonth(e.target.value)} className="w-full p-2 border rounded-md">
            <option value="2025-07">July</option>
            <option value="2025-08">August</option>
        </select>
        </div>
         <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Goal
        </button>
      </div>
    </div>
    );
}
export default SetGoals;
