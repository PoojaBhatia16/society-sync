import React, { useState } from "react";
import { loginUser } from "../api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  //for handling data 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    
  });
  //for handling errors

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    admin:"",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //functions
  const handleRegister = () => navigate("/register");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    
    let isValid = true;
    const newErrors = { ...errors };

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    

    if (!isValid) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      // console.log("ho gya login");
      toast.success("Login successful!");

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      const userString = localStorage.getItem("user");
      let userRole = null;
      if (userString) {
        try {
          const userObject = JSON.parse(userString);
          userRole = userObject.role;
        } catch (parseError) {
          console.error("Failed to parse user data from localStorage:", parseError);
        }
      }
      
      console.log("User role:", userRole);
      switch (userRole) {
        case "superadmin":
          navigate("/superAdminDashboard");
          break;
        case "admin":
          navigate("/adminDashboard");
          break;
        case "student":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
 
      
      const errorMessage =
        err?.response?.data?.message || 
        err?.message || 
        "Login failed. Please try again."; 
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));

      setIsLoading(false);
      }
    
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-2 w-full`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl px-4 py-2 w-full`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-sm text-gray-600 mt-2">
            <button
              type="button"
              onClick={handleRegister}
              className="text-blue-500 hover:underline"
            >
              Don't have an account? Register
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
