// src/components/VerifyAccount.jsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { postRequest } from "../config/api"; // Importing the postRequest function from api.js
import { AuthContext } from "../context/AuthContext";
import { FiInfo } from "react-icons/fi"; // Importing an icon from react-icons
import { FaGooglePay } from "react-icons/fa";

const VerifyAccount = () => {
  const { user, setUser } = useContext(AuthContext);
  // State to hold the PIN input by the user
  const [pin, setPin] = useState("");

  // State to handle loading status
  const [loading, setLoading] = useState(false);

  // State to handle any error messages
  const [error, setError] = useState("");

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoading(true); // Sets loading to true to display the loading indicator
    setError(""); // Resets any previous error messages

    try {
      // Making a POST request to '/user/verify' with the entered PIN
      const response = await postRequest("/user/verify", { pin });

      // If the response status is 200, navigate to '/dashboard'
      if (response.status === 200) {
        setUser((prev) => ({ ...prev, isVerified: true }));
        navigate("/dashboard");
      }
    } catch (err) {
      // Handling errors and setting appropriate error messages
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Verification Error:", err);
    } finally {
      setLoading(false); // Sets loading to false to hide the loading indicator
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Account Verification
          </h2>
          <p className="text-gray-600 text-sm">
            Enter your verification PIN to activate your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <FiInfo className="mr-2 min-w-[20px]" />
            {error}
          </div>
        )}

        {/* QR Code Section */}
        <div className="mb-6 text-center border-dashed border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
          <img
            src="/QR.png"
            alt="Payment QR Code"
            className="mx-auto w-48 h-48 object-contain mb-4 rounded-lg"
          />
          <div className="text-sm text-gray-600 italic">
            <FiInfo className="inline-block mr-1 text-blue-500" />
            Contact your admin/referral for PIN. For payment, scan the QR code.
          </div>
          <p className="font-semibold py-2">
             <span className=" italic">devbharatitribalfou@barodampay</span>
          </p>
        </div>

        {/* PIN Input Section */}
        <div className="mb-6">
          <label
            htmlFor="pin"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Verification PIN
          </label>
          <input
            type="text"
            id="pin"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter 6-digit verification code"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                {/* Loading spinner SVG */}
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Account"
          )}
        </button>
      </form>
    </div>
  );
};

export default VerifyAccount;
