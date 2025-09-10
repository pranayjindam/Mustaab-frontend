import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

// Simulating an API call for password reset
const resetPassword = async (email) => {
  try {
    const response = await fetch('YOUR_API_URL_HERE', {  // Replace with your API URL for password reset
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Password reset link sent! Check your email.');
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword(email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Remembered your password?{" "}
          <button
            onClick={() => window.location.href = "/login"}  // Redirect to login page
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
