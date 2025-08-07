import { useState } from "react";
import { FaEye, FaEyeSlash,FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const registerUser = async (formData) => {
  try {
    const response = await fetch('https://mustaab.onrender.com/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return { success: data.success, message: data.message, user: data.user || null };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    mobile: '',
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password Validation
    if (!formData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter.";
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter.";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number.";
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character.";
      isValid = false;
    }

    // Mobile Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required.";
      isValid = false;
    } else if (!mobileRegex.test(formData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await registerUser(formData);

    setIsLoading(false);

    if (result.success) {
      setStatusMessage(result.message);
      setMessageType("success");
    } else {
      setStatusMessage(result.message);
      setMessageType("error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>

        {statusMessage && (
          <div
            className={`p-4 mb-4 text-white text-center rounded-md ${
              messageType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
            />
            {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your mobile number"
            />
            {formErrors.mobile && <span className="text-red-500 text-sm">{formErrors.mobile}</span>}
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
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            {formErrors.password && <span className="text-red-500 text-sm">{formErrors.password}</span>}
          </div>

          <div className="mt-4 relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring focus:ring-blue-200"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-9 text-gray-500"
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>


          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

           <div className="my-4 flex items-center gap-2">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-500 text-sm">OR</span>
                    <hr className="flex-1 border-gray-300" />
                  </div>
                  {/* Google Sign-In */}
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100">
                    <FaGoogle className="text-red-500" />
                    <span className="font-medium">Continue with Google</span>
                  </button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")} 
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
