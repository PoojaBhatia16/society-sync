import React, { useState } from "react";
import { registerUser } from "../api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllSocieties } from "../api/societyApi";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "student",
    avatar: null,
    selectedSociety: "",
  });

  const [societies, setSocieties] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "",
    selectedSociety: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const handleRole = async (e) => {
    const role = e.target.value;
    setFormData({ ...formData, role });
    setErrors({ ...errors, role: "", general: "" });

    if (role === "admin") {
      try {
        const Societydata = await getAllSocieties();
        setSocieties(Societydata);
      } catch (error) {
        console.error("Failed to fetch societies:", error);
        setErrors({ ...errors, general: "Failed to fetch societies" });
        setFormData({ ...formData, role: "student" });
      }
    }
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({
      name: "",
      email: "",
      avatar: "",
      role: "",
      selectedSociety: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    let isValid = true;
    const newErrors = { ...errors };

    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // if (!formData.avatar) {
    //   newErrors.avatar = "Avatar is required";
    //   isValid = false;
    // }

    if (!formData.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    if (formData.role === "admin" && !formData.selectedSociety) {
      newErrors.selectedSociety = "Society is required for admin";
      isValid = false;
    }

    

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }


    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: formData.avatar,
        pendingSociety:
          formData.role === "admin" ? formData.selectedSociety : "",
      });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));

    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
          Create Your Account
        </h2>

        {/* General error message */}
        {errors.general && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          {/* Name Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 w-full text-sm`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* For email field specifically */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 w-full text-sm`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Avatar Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFormData({ ...formData, avatar: e.target.files[0] });
                setErrors({ ...errors, avatar: "", general: "" });
              }}
              className={`border ${
                errors.avatar ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-1.5 w-full text-sm`}
              required
            />
            {errors.avatar && (
              <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>
            )}
            {formData.avatar && (
              <div className="flex items-center mt-2">
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="preview"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: null })}
                  className="ml-2 text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRole}
              className={`border ${
                errors.role ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 w-full text-sm`}
              required
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Society Field (for admin) */}
          {formData.role === "admin" && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Society
              </label>
              <select
                name="selectedSociety"
                value={formData.selectedSociety}
                onChange={handleChange}
                className={`border ${
                  errors.selectedSociety ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2 w-full text-sm`}
                required
              >
                <option value="">Select Society</option>
                {societies.map((society) => (
                  <option key={society._id} value={society._id}>
                    {society.name}
                  </option>
                ))}
              </select>
              {errors.selectedSociety && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.selectedSociety}
                </p>
              )}
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 w-full text-sm`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg px-3 py-2 w-full text-sm`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm"
            >
              Register
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center text-xs text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
