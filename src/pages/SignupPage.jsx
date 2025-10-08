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
  const [step, setStep] = useState(1); // Step 1: request OTP, Step 2: verify OTP

  const [requestOtp, { isLoading: sendingOtp }] = useRequestRegisterOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyRegisterOtpMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const { name, mobile, email } = formData;

    if (!name) return alert("Name is required for registration");
    if (!mobile) return alert("Mobile is required");

    try {
      const res = await requestOtp({ name, mobile, email }).unwrap();
      console.log(res);
      if (res.mobileOtp) {
        alert("✅ OTP sent! Please verify to complete registration.");
        setStep(2);
      } else {
        // Backend will send this if user exists
        alert(res.message || "Cannot send OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "Error sending OTP");
    }
  };

  // 🔹 Step 2: Verify OTP
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
        navigate("/"); // redirect to homepage
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch (err) {
      alert(err?.data?.message || "Error verifying OTP");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Register with OTP
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg"
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile OTP</label>
              <input
                type="text"
                name="mobileOtp"
                value={formData.mobileOtp}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {formData.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email OTP</label>
                <input
                  type="text"
                  name="emailOtp"
                  value={formData.emailOtp}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-yellow-600 mt-2 hover:underline"
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
