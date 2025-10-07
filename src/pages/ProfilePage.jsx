"use client";
import React, { useState } from "react";
import {
  useRequestRegisterOtpMutation,
  useVerifyRegisterOtpMutation,
} from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    otp: "",
  });
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = verify OTP

  const [requestRegisterOtp, { isLoading: sendingOtp }] =
    useRequestRegisterOtpMutation();
  const [verifyRegisterOtp, { isLoading: verifyingOtp }] =
    useVerifyRegisterOtpMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Step 1: Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const { name, email, mobile } = formData;

    if (!name || !email || !mobile)
      return alert("Please fill all required fields");

    try {
      const res = await requestRegisterOtp({ name, email, mobile }).unwrap();
      if (res.success) {
        alert("OTP sent successfully!");
        setStep(2);
      } else {
        alert(res.message || "Failed to send OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "Error sending OTP");
    }
  };

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { name, email, mobile, otp } = formData;

    if (!otp) return alert("Please enter OTP");

    try {
      const res = await verifyRegisterOtp({ name, email, mobile, otp }).unwrap();

      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        alert("✅ Registration successful!");
        navigate("/");
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "Error verifying OTP");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create Account with OTP
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-200"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-yellow-600 mt-3 hover:underline"
            >
              Change Info
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-yellow-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
