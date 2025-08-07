import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice.js"; // ✅ Correct path


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate(user.role === "ADMIN" ? "/admin" : "/");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("https://mustaab.onrender.com/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success && data.token && data.user) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));

        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setStatusMessage("Login Successful!");
        setMessageType("success");

        // Role-based redirection
        setTimeout(() => {
          if (data.user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        setStatusMessage(data.message || "Login failed.");
        setMessageType("error");
      }
    } catch (error) {
      setStatusMessage("Something went wrong. Please try again.");
      setMessageType("error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>

        {statusMessage && (
          <div
            className={`p-3 mb-4 text-white text-center rounded-md ${
              messageType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mt-4 relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          No account?
          <Link to="/register" className="text-blue-600 font-semibold hover:underline ml-1">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
