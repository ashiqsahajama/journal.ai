import {use, useState} from "react";
function Register(){
    const [new_email,setnewemail ] = useState("");
    const [newpass , setnewpass ] = useState("");
    const [reenterpass, setreenterpass] = useState("");
    const [modalType,setModalType] = useState("");
    const [message,setMessage] = useState("");
    const [isModalOpen,setIsModalOpen] = useState(false);

    const handleCheckPass = () =>{
        if (newpass === '' || reenterpass === ''){
            setMessage("Please enter the password");
            setIsModalOpen(true);
            setModalType("error");
            return false;
        }
        else if(newpass === reenterpass){
            setMessage("Sucessfully created");
            setIsModalOpen(true);
            setModalType("success");
            return true;
        }

        else{
            setMessage("Password do not match");
            setIsModalOpen(true);
            setModalType("error");
            return false;
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const isValid  = handleCheckPass();
        if(!isValid) return;
        console.log("New User:",new_email);
        console.log("New Pass:",newpass);
        //Here will call api to register user
    };
    const closeModal = ()=>{
        setIsModalOpen(false);
    };

    let modalCol = "bg-blue-100";
    let modalBorder = "border-blue-300";
    let modalText = "text-blue-800";

    if (modalType ==='success'){
        modalCol = "bg-green-100";
        modalBorder="border-green-300";
        modalText = "text-green-800";
    }
    else{
        modalCol = "bg-red-100";
        modalBorder="border-red-300";
        modalText = "text-red-800";
    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 mt-2"> Register</h2>
            <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring"
                value = {new_email}
                onChange = {(e)=> setnewemail(e.target.value)}
                required
            />
            <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
            value = {newpass}
            onChange={(e)=>setnewpass(e.target.value)}
            />
            <input
            type="password"
            placeholder="Enter Password Again"
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring"
            value = {reenterpass}
            onChange = {(e)=> setreenterpass(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" onClick = {handleSubmit}>
            SignUp
            </button>
            {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className={`relative ${modalCol} border ${modalBorder} p-8 rounded-lg shadow-2xl w-full max-w-sm`}>
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
