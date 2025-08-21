"use client";
import React, { useState } from "react";
import { useLoginUserMutation } from "../redux/api/authApi.js";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = {
      identifier: formData.identifier.trim(),
      password: formData.password.trim(),
    };

    try {
      const res = await loginUser(trimmedData).unwrap();

      // Backend may return success: true/false with 200
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        alert("Login successful!");
        navigate("/");
      } else {
        // Backend returned 200 but success: false
        alert(res.message || "Login failed");
      }
    } catch (err) {
      // RTK Query sends non-2xx status here
      console.error("Login failed:", err);

      const errorMessage =
        err?.data?.message || // backend message
        err?.error ||          // fallback
        "Login failed";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email/Mobile
            </label>
            <input
              type="identifier"
              name="identifier"
              placeholder="Enter your identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
