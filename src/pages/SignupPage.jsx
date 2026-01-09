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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [requestOtp, { isLoading: sendingOtp }] =
    useRequestRegisterOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] =
    useVerifyRegisterOtpMutation();

  // ---------------- SEND OTP ----------------
  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Name is required");
    if (!mobile || mobile.length < 10)
      return alert("Enter a valid mobile number");

    try {
      const res = await requestOtp({ name, mobile }).unwrap();
      if (res.success) {
        alert("OTP sent to your mobile number");
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
      const res = await verifyOtp({ name, mobile, otp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        localStorage.setItem("token", res.token);
        alert("Registration successful!");
        navigate("/");
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "OTP verification failed");
    }
  };

  // ---------------- CHANGE INFO ----------------
  const handleChangeInfo = () => {
    setStep(1);
    setOtp("");
    setMobile("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border-t-4 border-yellow-400">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-5xl font-extrabold text-red-600">LSH</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-900">
          Create Your Account
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
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
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-2 rounded-lg"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Register"}
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
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-yellow-500 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
