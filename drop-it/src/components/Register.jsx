import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
const apiUrl = import.meta.env.VITE_API_URL;


const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    roles: "User",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.roles
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/register`, formData);

      if (res.data.success) {
        toast.success("User created successfully");
        setFormData({ email: "", password: "", username: "", roles: "User" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col-reverse lg:flex-row w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Image section with animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-1/2 bg-indigo-600"
        >
         ame="h-full w-full object-cover opacity-90"
         
        </motion.div>

        {/* Form section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full p-6 sm:p-8 md:p-10 lg:w-1/2"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Register for institutional access
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 rounded bg-red-100 p-3 text-center text-red-600"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 rounded bg-green-100 p-3 text-center text-green-600"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <input
                type="email"
                value={formData.email}
                placeholder="Email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </motion.div>

            {/* Roll No Input */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <input
                type="text"
                value={formData.username}
                placeholder="username"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </motion.div>

            {/* Password Input with Visibility Toggle */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="Password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-300 p-3 pr-10 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {/* Toggle Button for Password Visibility */}
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </motion.div>

            {/* Role Selection */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <select
                value={formData.roles}
                onChange={(e) =>
                  setFormData({ ...formData, roles: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="User">User</option>
                <option value="Vendor">Vendor</option>
                <option value="Industrialist">Industrialist</option>
                <option value="Admin">Admin</option>
              </select>
            </motion.div>

            {/* Signup Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-lg bg-indigo-600 p-3 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            >
              Signup
            </motion.button>
          </form>

          {/* Login Redirect */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-gray-600"
          >
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;