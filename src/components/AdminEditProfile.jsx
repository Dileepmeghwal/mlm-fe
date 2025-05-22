// src/components/AdminEditProfile.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRequest, getUserId, postRequest } from "../config/api";
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
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminEditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = location.state?.userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getRequest(`/user/get-by-id/${userId}`);
        setUserData(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to update this user's profile?")
    ) {
      try {
        await postRequest("/user/admin/edit-profile", {
          ...formData,
          userId: userId,
        });
        
        toast.success("User profile updated successfully!");
        navigate(-1); // Go back to previous page
      } catch (err) {
        toast.error("Failed to update user profile");
        console.error("Update Error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">
          Loading User Data...
        </p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-red-500">
          {error || "User not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-lg hover:bg-blue-400 transition-colors"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <div className="bg-white p-4 rounded-full shadow-md">
              <FaUser className="text-4xl text-blue-500" />
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-bold">
                Edit {userData.first_name} {userData.last_name}
              </h1>
              <p className="text-lg opacity-80">User ID: {getUserId(userData?.userId)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={<FaUser />}
                  label="First Name"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaUser />}
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaEnvelope />}
                  label="Email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  type="email"
                />
                <FormField
                  icon={<FaPhone />}
                  label="Mobile"
                  name="mobile_number"
                  value={formData.mobile_number || ""}
                  onChange={handleInputChange}
                  type="tel"
                />
                <FormField
                  icon={<FaBirthdayCake />}
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={<FaHome />}
                  label="Address Line 1"
                  name="adress1"
                  value={formData.adress1 || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaHome />}
                  label="Address Line 2"
                  name="adress2"
                  value={formData.adress2 || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={<FaIdCard />}
                  label="PAN Number"
                  name="pan"
                  value={formData.pan || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaIdCard />}
                  label="Aadhaar Number"
                  name="adhaar"
                  value={formData.adhaar || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaMobile />}
                  label="UPI ID"
                  name="upi"
                  value={formData.upi || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaUniversity />}
                  label="Bank Account Number"
                  name="bankAC"
                  value={formData.bankAC || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaUniversity />}
                  label="IFSC Code"
                  name="ifsc"
                  value={formData.ifsc || ""}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FaUniversity />}
                  label="Bank Name / Branch"
                  name="bankName"
                  value={formData.bankName || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaSave className="mr-2" />
                Save All Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormField = ({ icon, label, name, value, onChange, type = "text" }) => (
  <div className="flex items-center">
    <span className="text-gray-500 mr-3">{icon}</span>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

export default AdminEditProfile;
