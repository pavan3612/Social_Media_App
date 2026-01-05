import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

const Authentication = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  
  // ADD THIS: Clear any old/bad tokens immediately when loading the page
  // This ensures the login request is "clean"
  React.useEffect(() => {
    localStorage.clear(); 
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", // Maps to User.java 'mail' or LoginRequest 'email'
    password: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // --- REGISTER FLOW ---
        const payload = { 
            firstName: formData.firstName,
            lastName: formData.lastName,
            mail: formData.email, 
            password: formData.password,
            gender: formData.gender
        };
        
        const { data } = await api.post("/Auth/signUp", payload);
        
        // 1. Store the token
        localStorage.setItem("jwt", data.token); 
        
        alert("Registration Successful!");
        
        // 2. Redirect to HOME (Change "/" to "/home")
        navigate("/home"); 
        
      } else {
       // --- LOGIN FLOW ---
  const response = await api.post("/Auth/signIn", {
    email: formData.email,
    password: formData.password,
  });

  // DEBUGGING: Check what the backend actually returns
  console.log("Login Response:", response.data); 

  // FIX: specific check for common token names (token vs jwt)
  const token = response.data.token || response.data.jwt; 
  
  if (!token) {
      alert("Login failed: No token received");
      return;
  }

  localStorage.setItem("jwt", token);
  navigate("/home");
      }
    } catch (error) {
      console.error("Auth Error", error);
      alert("Authentication failed. Check console.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Left Side - Network Background (Placeholder for image) */}
      <div className="w-[60%] hidden lg:flex items-center justify-center bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
         {/* You can put the actual network image here using an <img> tag */}
        <h1 className="z-10 text-6xl font-bold text-blue-500">Learn Insta</h1>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-10">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-400">
            Learn Insta
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Connecting Lives, Sharing Stories: Your Social World, Your Way
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full bg-transparent border border-gray-600 p-3 rounded-md focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full bg-transparent border border-gray-600 p-3 rounded-md focus:outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-600 p-3 rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent border border-gray-600 p-3 rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />

            {isRegister && (
              <div className="flex gap-4 text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="male" onChange={handleChange} /> Male
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="female" onChange={handleChange} /> Female
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-300"
            >
              {isRegister ? "REGISTER" : "LOGIN"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isRegister ? (
              <p>
                If you have already account ?{" "}
                <span
                  onClick={() => setIsRegister(false)}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  LOGIN
                </span>
              </p>
            ) : (
              <p>
                Don't have an account ?{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  REGISTER
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;