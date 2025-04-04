import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const imageUrls = [
    '/img3.png',
    '/img1.png',
    '/img2.png',
    '/img4.png',
  ];
  
  const imagePositions = [
    { position: 'top-10 left-5' },
    { position: 'top-20 right-10' },
    { position: 'bottom-40 left-20' },
    { position: 'bottom-20 right-20' },
    { position: 'top-40 right-5' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.roles
    ) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/register`, formData);

      if (res.data.success) {
        toast.success("User created successfully");
        setSuccess("Registration successful! You can now login.");
        setFormData({ email: "", password: "", username: "", roles: "User" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden"
      style={{ 
        backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        backgroundColor: '#f0f0f0' 
      }}
    >
      {/* Background pixel images */}
      {imageUrls.map((url, index) => (
        <img 
          key={index} 
          src={url} 
          alt="Pixel background" 
          className={`absolute opacity-30 rounded-lg w-24 h-24 ${imagePositions[index % imagePositions.length].position}`}
        />
      ))}
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col-reverse lg:flex-row w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl border-4 border-black">
          {/* Image section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block w-1/2 bg-white border-r-4 border-black relative overflow-hidden"
          >
            <div className="h-full w-full flex items-center justify-center">
              <img 
                src="./img7.png" 
                alt="byooooob logo" 
                className="w-[300px] transform -rotate-12 pixel-font tracking-wider" 
              />
            </div>
          </motion.div>

          {/* Form section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full p-6 sm:p-8 md:p-10 lg:w-1/2"
          >
            <h2 className="mb-6 text-center text-3xl font-bold text-blue-400 tracking-wider">
              Create Account
            </h2>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-600 border-2 border-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 rounded-lg bg-green-100 p-3 text-center text-green-600 border-2 border-green-300"
              >
                {success}
              </motion.div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <input
                  type="email"
                  value={formData.email}
                  placeholder="Email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-400 p-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </motion.div>

              {/* Username Input */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <input
                  type="text"
                  value={formData.username}
                  placeholder="Username"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-400 p-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-400 p-3 pr-10 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
                {/* Toggle Button for Password Visibility */}
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </motion.div>

              {/* Role Selection */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <select
                  value={formData.roles}
                  onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-400 p-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                >
                  <option value="User">User</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Industrialist">Industrialist</option>
                  <option value="Admin">Admin</option>
                </select>
              </motion.div>

              {/* Register Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-lg bg-blue-400 p-3 text-black font-bold transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 border-2 border-black pixel-font"
                disabled={loading}
              >
                {loading ? "REGISTERING..." : "SIGN UP"}
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
              <Link to="/login" className="text-blue-600 hover:underline font-bold">
                Login
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;