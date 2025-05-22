// src/components/UserDetails.jsx

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getRequest, getUserId, postRequest } from "../config/api";
import {
  FaUser,
  FaIdBadge,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaTag,
  FaCheckCircle,
  FaWallet,
  FaBan,
  FaCalendarPlus,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaUnlock,
  FaHome, // For address fields
  FaIdCard, // For PAN and Aadhaar
  FaMobile, // For UPI
  FaUniversity,
  FaEdit, // For bank details
} from "react-icons/fa";
import { FaWalkieTalkie } from "react-icons/fa6";
import moment from "moment";
import { toast } from "react-toastify";
const UserDetails = () => {
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const userId = location.state?.userId;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        setError("No user ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await getRequest(`/user/get-by-id/${userId}`);
        setUserDetails(response.data);
      } catch (err) {
        setError("Failed to fetch user details. Please try again later.");
        console.error("UserDetails Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleBlockUnblock = async () => {
    try {
      const payload = {
        userId: userDetails.userId,
        isBlock: !userDetails.isBlock,
      };
      await postRequest("/user/block-unblock", payload);
      setUserDetails((prev) => ({ ...prev, isBlock: !prev.isBlock }));
      setShowPopup(false);
    } catch (err) {
      console.error("Block/Unblock Error:", err);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">
          Loading User Details...
        </p>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-red-500">
          {error || "No user data found."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="bg-white p-4 rounded-full shadow-md">
            <FaUser className="text-4xl text-blue-500" />
          </div>
          <div className="ml-6">
            <h1 className="text-4xl font-bold">
              {userDetails.first_name} {userDetails.last_name}
            </h1>
            <p className="text-lg opacity-80 py-2">
              User ID: {getUserId(userDetails.userId)}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      {/* Details Section */}
      <div className="max-w-6xl mx-auto -mt-6 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <FaUser className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.first_name} {userDetails.last_name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Mobile:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.mobile_number || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaBirthdayCake className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Date of Birth:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {moment(userDetails.dob).format("MMMM DD, YYYY") ||
                        "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaHome className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Address Line 1:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.adress1 || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaHome className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Address Line 2:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.adress2 || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <FaTag className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Verified:</span>
                    <span
                      className={`ml-2 ${
                        userDetails.isVerified
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {userDetails.isVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaWallet className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Wallet Balance:
                    </span>
                    <span className="ml-2 text-gray-900">
                      ₹{userDetails.wallet.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaBan className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span
                      className={`ml-2 ${
                        userDetails.isBlock ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {userDetails.isBlock ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <FaIdCard className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">PAN:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.pan || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaIdCard className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">Aadhaar:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.adhaar || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMobile className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">UPI:</span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.upi || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUniversity className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Bank Account Number:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.bankAC || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUniversity className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      IFSC Code:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.ifsc || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUniversity className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Bank Name:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {userDetails.bankName || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <FaCalendarPlus className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Created At:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {new Date(userDetails.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarCheck className="text-gray-500 mr-3 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">
                      Updated At:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {new Date(userDetails.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block/Unblock Button */}
          <div className="flex">
            <div className="mt-8">
              <button
                onClick={() => setShowPopup(true)}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors ${
                  userDetails.isBlock
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {userDetails.isBlock ? (
                  <FaUnlock className="mr-2" />
                ) : (
                  <FaBan className="mr-2" />
                )}
                {userDetails.isBlock ? "Unblock User" : "Block User"}
              </button>
            </div>
            <div className="mt-8 ml-8">
              <Link
                to="/userDetails/edit"
                state={{ userId: userId }} // Pass userId in state
                className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </Link>
            </div>
            <div className="mt-8 ml-8">
              <Link
                to="/user/transaction"
                state={{ userId: userId }} // Pass userId in state
                className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              >
                <FaWalkieTalkie className="mr-2" />
                See Transaction History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 mr-3 text-2xl" />
              <h2 className="text-xl font-semibold text-gray-800">
                Confirm Action
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to{" "}
              {userDetails.isBlock ? "unblock" : "block"} this user?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUnblock}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                  userDetails.isBlock
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {userDetails.isBlock ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
