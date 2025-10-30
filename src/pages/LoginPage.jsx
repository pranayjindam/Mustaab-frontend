"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  useRequestLoginOtpMutation,
  useVerifyLoginOtpMutation,
} from "../redux/api/authApi";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "",
    mobile: "",
    email: "",
    mobileOtp: "",
    emailOtp: "",
  });
  const [step, setStep] = useState(1);

  const [requestOtp, { isLoading: sendingOtp }] = useRequestLoginOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyLoginOtpMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const { identifier } = formData;
    if (!identifier) return alert("Mobile or Email is required");

    try {
      const res = await requestOtp({ identifier }).unwrap();
      if (res.success) {
        alert("OTP sent successfully!");
        setStep(2);
        if (/\S+@\S+\.\S+/.test(identifier)) {
          setFormData((prev) => ({ ...prev, email: identifier }));
        } else {
          setFormData((prev) => ({ ...prev, mobile: identifier }));
        }
      } else alert(res.message || "Failed to send OTP");
    } catch (err) {
      alert(err?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { mobile, email, mobileOtp, emailOtp } = formData;
    if (!mobileOtp && !emailOtp)
      return alert("At least one OTP is required to verify");

    try {
      let identifier = mobile || email;
      let otp = mobileOtp || emailOtp;
      const res = await verifyOtp({ identifier, otp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        localStorage.setItem("token", res.token);
        alert("Login successful!");
        navigate("/");
      } else alert(res.message || "Invalid OTP");
    } catch (err) {
      alert(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border-t-4 border-yellow-400">
        {/* 🔴 LSH Logo */}
        <div className="flex justify-center mb-4">
          <h1 className="text-5xl font-extrabold text-red-600 tracking-wide">LSH</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
          Login with OTP
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900">
                Mobile or Email
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or mobile number"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-2 rounded-lg transition-colors"
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {formData.mobile && (
              <div>
                <label className="block text-sm font-medium text-blue-900">
                  Mobile OTP
                </label>
                <input
                  type="text"
                  name="mobileOtp"
                  value={formData.mobileOtp || ""}
                  onChange={handleChange}
                  placeholder="Enter mobile OTP"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            )}

            {formData.email && (
              <div>
                <label className="block text-sm font-medium text-blue-900">
                  Email OTP
                </label>
                <input
                  type="text"
                  name="emailOtp"
                  value={formData.emailOtp || ""}
                  onChange={handleChange}
                  placeholder="Enter email OTP"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-2 rounded-lg transition-colors"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-blue-800 mt-2 hover:underline"
            >
              Change Info
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
