import { useState } from "react";
import { register } from "../services/auth"; // Import register service


function Register() {
const [new_name, setNewName] = useState(""); // New state for name
const [new_email, setNewEmail] = useState("");
const [new_pass, setNewPass] = useState("");
const [reenter_pass, setReenterPass] = useState("");
const [message, setMessage] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalType, setModalType] = useState("");


// Handle password validation
const handleCheckPass = () => {
if (new_pass === "" || reenter_pass === "") {
setMessage("Please enter the password");
setIsModalOpen(true);
setModalType("error");
return false;
} else if (new_pass === reenter_pass) {
setMessage("Successfully created");
setIsModalOpen(true);
setModalType("success");
return true;
} else {
setMessage("Passwords do not match");
setIsModalOpen(true);
setModalType("error");
return false;
}
};


// Handle form submission
const handleSubmit = async (e) => {
e.preventDefault();
const isValid = handleCheckPass();
if (!isValid) return;


try {
const response = await register(new_name, new_email, new_pass); // Updated API call with name
localStorage.setItem("token", response.data.access_token); // Store token in localStorage (if needed)
console.log("Registration successful", response.data); // Log success
// Redirect user to another page or show success
// For example, navigate to login page
} catch (error) {
console.error("Registration error", error);
setMessage("Registration failed! Please try again.");
setIsModalOpen(true);
setModalType("error");
}
};


// Modal close function
const closeModal = () => {
setIsModalOpen(false);
};


// Modal color based on success/error
let modalCol = "bg-blue-100";
let modalBorder = "border-blue-300";
let modalText = "text-blue-800";


if (modalType === "success") {
modalCol = "bg-green-100";
modalBorder = "border-green-300";
modalText = "text-green-800";
} else {
modalCol = "bg-red-100";
modalBorder = "border-red-300";
modalText = "text-red-800";
}


return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
<h2 className="text-3xl font-bold text-center mb-6 mt-2">Register</h2>


{/* Name input */}
<input
type="text"
placeholder="Full Name"
className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
value={new_name}
onChange={(e) => setNewName(e.target.value)}
required
/>


{/* Email input */}
<input
type="email"
placeholder="Email"
className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
value={new_email}
onChange={(e) => setNewEmail(e.target.value)}
required
/>


{/* Password input */}
<input
type="password"
placeholder="Password"
className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
value={new_pass}
onChange={(e) => setNewPass(e.target.value)}
/>


{/* Confirm password input */}
<input
type="password"
placeholder="Enter Password Again"
className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
value={reenter_pass}
onChange={(e) => setReenterPass(e.target.value)}
/>


{/* Submit button */}
<button
className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
onClick={handleSubmit}
>
SignUp
</button>


{/* Modal for success/error message */}
{isModalOpen && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
<div
className={`relative ${modalCol} border ${modalBorder} p-8 rounded-lg shadow-2xl w-full max-w-sm`}
>
<button
onClick={closeModal}
className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
aria-label="Close"
>
&times;
</button>
<p className={`text-center text-xl font-semibold ${modalText} mb-6`}>
{message}
</p>
<div className="flex justify-center">
<button
onClick={closeModal}
className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
>
OK
</button>
</div>
</div>
</div>
)}
</div>
</div>
);
}


export default Register;




