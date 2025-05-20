// src/components/UserProfile.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRequest } from "../config/api";
import moment from "moment";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaTag,
  FaCheckCircle,
  FaWallet,
  FaCalendarPlus,
  FaCalendarCheck,
  FaHome,
  FaIdCard,
  FaMobile,
  FaUniversity,
  FaEdit,
} from "react-icons/fa";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getRequest("/user/profile");
        setUserDetails(response.data);
      } catch (err) {
        setError("Failed to fetch user details. Please try again later.");
        console.error("UserProfile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Loading Profile...</p>
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
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full shadow-md">
              <FaUser className="text-4xl text-blue-500" />
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-bold">
                {userDetails.first_name} {userDetails.last_name}
              </h1>
              <p className="text-lg opacity-80">
                Member since{" "}
                {new Date(userDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link
            to="/profile/edit"
            className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Details */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileDetailItem
                icon={<FaUser className="text-gray-500" />}
                label="Name"
                value={`${userDetails.first_name} ${userDetails.last_name}`}
              />
              <ProfileDetailItem
                icon={<FaEnvelope className="text-gray-500" />}
                label="Email"
                value={userDetails.email}
              />
              <ProfileDetailItem
                icon={<FaPhone className="text-gray-500" />}
                label="Mobile"
                value={userDetails.mobile_number || "Not provided"}
              />
              <ProfileDetailItem
                icon={<FaBirthdayCake className="text-gray-500" />}
                label="Date of Birth"
                value={
                  moment(userDetails.dob).format("MMMM DD, YYYY") ||
                  "Not provided"
                }
              />
              <ProfileDetailItem
                icon={<FaHome className="text-gray-500" />}
                label="Address"
                value={
                  [userDetails.adress1, userDetails.adress2]
                    .filter(Boolean)
                    .join(", ") || "Not provided"
                }
              
              />
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileDetailItem
                icon={<FaTag className="text-gray-500" />}
                label="Account Type"
                value={userDetails.type}
              />
              <ProfileDetailItem
                icon={<FaCheckCircle className="text-gray-500" />}
                label="Verification Status"
                value={
                  <span
                    className={
                      userDetails.isVerified ? "text-green-600" : "text-red-600"
                    }
                  >
                    {userDetails.isVerified
                      ? "Verified"
                      : "Pending Verification"}
                  </span>
                }
              />
              <ProfileDetailItem
                icon={<FaWallet className="text-gray-500" />}
                label="Wallet Balance"
                value={`₹${userDetails.wallet?.toFixed(2) || "0.00"}`}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Financial Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileDetailItem
                icon={<FaIdCard className="text-gray-500" />}
                label="PAN Number"
                value={userDetails.pan || "Not provided"}
              />
              <ProfileDetailItem
                icon={<FaIdCard className="text-gray-500" />}
                label="Aadhaar Number"
                value={userDetails.adhaar || "Not provided"}
              />
              <ProfileDetailItem
                icon={<FaMobile className="text-gray-500" />}
                label="UPI ID"
                value={userDetails.upi || "Not provided"}
              />
              <ProfileDetailItem
                icon={<FaUniversity className="text-gray-500" />}
                label="IFSC"
                value={
                  userDetails.ifsc
                    ? `${userDetails.ifsc}`
                    : "Not provided"
                }
              />
              <ProfileDetailItem
                icon={<FaUniversity className="text-gray-500" />}
                label="Bank Name / Branch Name"
                value={
                  userDetails.bankAC
                    ? `${userDetails.bankName}`
                    : "Not provided"
                }
              />
              <ProfileDetailItem
                icon={<FaUniversity className="text-gray-500" />}
                label="Bank Account "
                value={
                  userDetails.bankAC ? ` ${userDetails.bankAC}` : "Not provided"
                }
              />
            </div>
          </div>

          {/* Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Account Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileDetailItem
                icon={<FaCalendarPlus className="text-gray-500" />}
                label="Account Created"
                value={new Date(userDetails.createdAt).toLocaleString()}
              />
              <ProfileDetailItem
                icon={<FaCalendarCheck className="text-gray-500" />}
                label="Last Updated"
                value={new Date(userDetails.updatedAt).toLocaleString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDetailItem = ({ icon, label, value, fullWidth = false }) => (
  <div className={`flex items-start ${fullWidth ? "col-span-2" : ""}`}>
    <span className="mr-3 mt-1 ">{icon}</span>
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className=" text-gray-900">{value}</div>
    </div>
  </div>
);

export default UserProfile;
