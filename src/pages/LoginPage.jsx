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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [requestOtp, { isLoading: sendingOtp }] =
    useRequestLoginOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] =
    useVerifyLoginOtpMutation();

  // ---------------- SEND OTP ----------------
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10)
      return alert("Enter a valid mobile number");

    try {
      const res = await requestOtp({ mobile }).unwrap();
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

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Enter OTP");

    try {
      const res = await verifyOtp({ mobile, otp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        localStorage.setItem("token", res.token);
        alert("Login successful!");
        navigate("/");
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "Invalid OTP");
    }
  };

  // ---------------- CHANGE INFO (IMPORTANT FIX) ----------------
  const handleChangeInfo = () => {
    setStep(1);
    setOtp("");        // clear old OTP
    setMobile("");     // clear mobile to avoid auto resend confusion
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border-t-4 border-yellow-400">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <h1 className="text-5xl font-extrabold text-red-600">LSH</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
          Login with Mobile OTP
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-2 rounded-lg"
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-2 rounded-lg"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={handleChangeInfo}
              className="w-full text-blue-800 hover:underline"
            >
              Change Mobile Number
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
