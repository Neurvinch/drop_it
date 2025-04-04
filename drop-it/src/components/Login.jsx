import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";




const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    password: "",
    username: "",
    roles: "User",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/login`, formData);

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        toast.success("Login successful");

        const decoded = jwtDecode(token);

        if (decoded.roles === "hod") {
          navigate("/cumulative-report");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
    setLoading(false);
  };

  // if (loading) {
  //   return <LoadingComponent />;
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden w-1/2 bg-indigo-600 lg:block"
        >
         
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full p-8 lg:w-1/2"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Login
          </h2>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 rounded bg-red-100 p-3 text-center text-red-600"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {/* Eye Icon for Password Visibility */}
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

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-lg bg-indigo-600 p-3 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
            >
              Login
            </motion.button>
          </form>

          <a href="/forgotPasssword"> Forgot Password ?</a>

          {/* Signup Redirect */}
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-gray-600"
          >
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Signup
            </a>
          </motion.p> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;