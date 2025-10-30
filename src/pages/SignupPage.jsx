"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  useRequestRegisterOtpMutation,
  useVerifyRegisterOtpMutation,
} from "../redux/api/authApi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    mobileOtp: "",
    emailOtp: "",
  });
  const [step, setStep] = useState(1);

  const [requestOtp, { isLoading: sendingOtp }] = useRequestRegisterOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyRegisterOtpMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const { name, mobile, email } = formData;
    if (!name) return alert("Name is required");
    if (!mobile) return alert("Mobile is required");

    try {
      const res = await requestOtp({ name, mobile, email }).unwrap();
      if (res.mobileOtp) {
        alert("✅ OTP sent! Please verify to complete registration.");
        setStep(2);
      } else {
        alert(res.message || "Unable to send OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { name, mobile, email, mobileOtp, emailOtp } = formData;
    if (!mobileOtp) return alert("Mobile OTP is required");

    try {
      const res = await verifyOtp({ name, mobile, email, mobileOtp, emailOtp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        localStorage.setItem("token", res.token);
        alert("✅ Registration successful!");
        navigate("/");
      } else alert(res.message || "Invalid OTP");
    } catch (err) {
      alert(err?.data?.message || "Error verifying OTP");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        {/* 🔴 LSH Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-red-600 tracking-wide">
            LSH
          </h1>
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
          Create Your Account
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
                placeholder="Enter your full name"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
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
                placeholder="Enter your mobile number"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email (optional)"
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-blue-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile OTP
              </label>
              <input
                type="text"
                name="mobileOtp"
                value={formData.mobileOtp}
                onChange={handleChange}
                placeholder="Enter mobile OTP"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {formData.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email OTP
                </label>
                <input
                  type="text"
                  name="emailOtp"
                  value={formData.emailOtp}
                  onChange={handleChange}
                  placeholder="Enter email OTP"
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-red-600 mt-2 hover:underline"
            >
              Change Info
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
