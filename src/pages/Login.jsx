// Import necessary modules first
import { useState } from "react";
import { login } from "../services/auth"; // Import login service

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password); // Call login function from auth.js
      localStorage.setItem("token", response.data.access_token); // Save token in localStorage
      console.log("Login success", response.data); // Log response data
      // TODO: Redirect user to dashboard or home page upon successful login
    } catch (error) {
      console.error("Login error", error); // Handle error
      // TODO: Display user-friendly error message (e.g., "Invalid credentials")
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2 mt-2">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;