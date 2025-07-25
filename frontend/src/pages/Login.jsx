import { useState } from "react";
import { login } from "../services/auth";  // Import login service
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirecting

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // For error handling
  const [isLoading, setIsLoading] = useState(false);  // For loading state
  const navigate = useNavigate();  // For navigation after successful login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await login(email, password);  // Send request to backend
      localStorage.setItem("token", response.data.access_token);  // Store token in localStorage
      console.log("Login successful", response.data);
      navigate("/dashboard");  // Redirect to Dashboard after successful login
    } catch (error) {
      setErrorMessage("Invalid credentials, please try again!");  // Display error message
      console.error("Login error", error);
    } finally {
      setIsLoading(false);  // End loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-2 mt-2">Login</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
          disabled={isLoading}  // Disable button while loading
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
