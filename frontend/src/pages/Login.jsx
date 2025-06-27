import React, { useState } from "react";
import { loginUser } from "../api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleRegister = () => {
    navigate("/register");
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      toast.success("Login successful!");
      // console.log("User data:", res.data.user);
      // console.log("Access Token:", res.data.accessToken);
      // console.log("Refresh Token:", res.data.refreshToken);
      
      // After successful login
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log(res);
      // Redirect to dashboard or home page
      navigate("/dashboard");

      
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-2 w-full"
              required
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <button type="button" onClick={handleRegister}>
              Don't have an account? Register
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
