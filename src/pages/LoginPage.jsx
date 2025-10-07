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
    identifier: "", // added to fix uncontrolled input
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

  // Handle form input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const { identifier } = formData;
    if (!identifier) return alert("Mobile or Email is required");

    try {
      const res = await requestOtp({ identifier }).unwrap();
      if (res.success) {
        alert("OTP sent successfully!");
        setStep(2);

        // Pre-fill mobile/email if possible
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

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { mobile, email, mobileOtp, emailOtp } = formData;

    if (!mobileOtp && !emailOtp)
      return alert("At least one OTP is required to verify");

    try {
      // Try mobile OTP first
      let identifier = mobile || email;
      let otp = mobileOtp || emailOtp;

      const res = await verifyOtp({ identifier, otp }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token }));
        localStorage.setItem("token", res.token);
        alert("Login successful!");
        navigate("/"); // redirect to homepage
      } else alert(res.message || "Invalid OTP");
    } catch (err) {
      alert(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Login with OTP</h2>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile or Email
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or mobile number"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {formData.mobile && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile OTP
                </label>
                <input
                  type="text"
                  name="mobileOtp"
                  value={formData.mobileOtp || ""}
                  onChange={handleChange}
                  placeholder="Enter mobile OTP"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {formData.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email OTP
                </label>
                <input
                  type="text"
                  name="emailOtp"
                  value={formData.emailOtp || ""}
                  onChange={handleChange}
                  placeholder="Enter email OTP"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-blue-600 mt-2 hover:underline"
            >
              Change Info
            </button>
          </form>
        )}
      <p className="text-sm text-gray-600 mt-6 text-center">
          Dont have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
