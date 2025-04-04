import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
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
    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/login`, formData);

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        toast.success("Login successful");

        // Since jwtDecode wasn't imported in the original code, I'll add a try/catch
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          if (decoded.roles === "hod") {
            navigate("/cumulative-report");
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          navigate("/dashboard");
        }
      } else {
        toast.error("Login failed. Please try again.");
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
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
          className={`absolute opacity-30 rounded-lg w-24 h-24 ${imagePositions[index].position}`}
        />
      ))}
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col-reverse lg:flex-row w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl border-4 border-black">
          {/* Image section */}
          <div className="hidden lg:block w-1/2 bg-whiteborder-r-4 border-black relative overflow-hidden">
            {/* Pixel art overlay pattern */}
            
            <div className="h-full w-full flex items-center justify-center">
            <img 
  src="./img1.png" 
  alt="byooooob logo" 
  className="w-[300px] transform -rotate-12 pixel-font tracking-wider" 
/>

            </div>
          </div>

          {/* Form section */}
          <div className="w-full p-6 sm:p-8 md:p-10 lg:w-1/2">
            <h2 className="mb-6 text-center text-3xl font-bold text-blue-400 tracking-wider">
              Login
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-600 border-2 border-red-300">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <input
                  type="text"
                  value={formData.username}
                  placeholder="Username"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-400 p-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Password Input with Visibility Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  placeholder="Password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-400 p-3 pr-10 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
                {/* Eye Icon for Password Visibility */}
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>

              {/* Role Selection */}
              <div>
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
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-400  p-3 text-black font-bold transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 border-2 border-black pixel-font"
                disabled={loading}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <a href="/forgotPasssword" className="text-black hover:underline font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Register Redirect */}
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-bold">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;