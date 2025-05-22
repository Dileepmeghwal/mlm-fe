import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// src/components/EditProfile.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../config/api";
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
  FaTimes,
  FaEdit,
} from "react-icons/fa";

const EditProfile = () => {
  const [userData, setUserData] = useState(null);
  const [financialData, setFinancialData] = useState({
    pan: "",
    adhaar: "",
    upi: "",
    bankAC: "",
    ifsc: "",
    bankName: "",
  });
  const [confirmAccount, setConfirmAccount] = useState("");
  const [showFinancialConfirm, setShowFinancialConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
const navigate= useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getRequest("/user/profile");
        setUserData(response.data);
        setFinancialData({
          pan: response.data.pan || "",
          adhaar: response.data.adhaar || "",
          upi: response.data.upi || "",
          bankAC: response.data.bankAC || "",
          ifsc: response.data.ifsc || "",
          bankName: response.data.bankName || "",
        });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load profile data");
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await postRequest("/user/edit-profile/general", {
        first_name: userData.first_name,
        last_name: userData.last_name,
        mobile_number: userData.mobile_number,
        dob: userData.dob,
        adress1: userData.adress1,
        adress2: userData.adress2,
      });
      
      alert("Basic information updated successfully");
      navigate("/profile")
      
    } catch (err) {
      alert("Failed to update basic information");
    }
  };

  const handleFinancialSubmit = async () => {
    if (financialData.bankAC !== confirmAccount) {
      setErrors({ ...errors, accountMatch: "Account numbers do not match" });
      return;
    }

    try {
      await postRequest("/user/edit-profile/financial", financialData);
      toast.success("Financial information updated successfully");
      setShowFinancialConfirm(false);
      setFinancialData((prev) => ({ ...prev, submitted: true }));
      navigate("/profile")
    } catch (err) {
      toast.error("Failed to update financial information");
    }
  };

  const isFinancialEditable = () => {
    return !userData?.pan && !userData?.adhaar && !userData?.bankAC;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full shadow-md">
              <FaUser className="text-4xl text-blue-500" />
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-bold">Edit Profile</h1>
              <Link
                to="/profile"
                className="text-lg opacity-80 hover:underline"
              >
                ← Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Personal Information Form */}
        <form
          onSubmit={handleBasicInfoSubmit}
          className="bg-white p-8 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Personal Information
          </h2>

          <div className="space-y-6">
            <FormSection
              icon={<FaUser className="text-gray-500" />}
              label="Name"
              value={
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={userData.first_name}
                    onChange={(e) =>
                      setUserData({ ...userData, first_name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={userData.last_name}
                    onChange={(e) =>
                      setUserData({ ...userData, last_name: e.target.value })
                    }
                  />
                </div>
              }
            />

            <FormSection
              icon={<FaEnvelope className="text-gray-500" />}
              label="Email"
              value={
                <input
                  type="email"
                  className="p-2 border rounded w-full"
                  value={userData.email}
                  readOnly
                />
              }
            />

            <FormSection
              icon={<FaPhone className="text-gray-500" />}
              label="Mobile Number"
              value={
                <input
                  type="tel"
                  className="p-2 border rounded w-full"
                  value={userData.mobile_number}
                  onChange={(e) =>
                    setUserData({ ...userData, mobile_number: e.target.value })
                  }
                />
              }
            />

            <FormSection
              icon={<FaBirthdayCake className="text-gray-500" />}
              label="Date of Birth"
              aria-label="Date of Birth"
              value={
                <input
                  type="date"
                  className="p-2 border rounded w-full"
                  // value={userData.dob}
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                />
              }
            />

            <FormSection
              icon={<FaHome className="text-gray-500" />}
              label="Address Line 1"
              value={
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  value={userData.adress1}
                  onChange={(e) =>
                    setUserData({ ...userData, adress1: e.target.value })
                  }
                />
              }
            />

            <FormSection
              icon={<FaHome className="text-gray-500" />}
              label="Address Line 2"
              value={
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  value={userData.adress2}
                  onChange={(e) =>
                    setUserData({ ...userData, adress2: e.target.value })
                  }
                />
              }
            />

            <div className="mt-6">
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaSave className="mr-2" />
                Save Personal Information
              </button>
            </div>
          </div>
        </form>

        {/* Financial Information Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Financial Information
          </h2>

          <div className="space-y-6">
            <FormSection
              icon={<FaIdCard className="text-gray-500" />}
              label="PAN Number"
              value={
                <input
                  type="text"
                  className={`p-2 border rounded w-full ${
                    !isFinancialEditable() ? "bg-gray-100" : ""
                  }`}
                  value={financialData.pan}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, pan: e.target.value })
                  }
                  disabled={!isFinancialEditable()}
                  maxLength="10"
                />
              }
            />

            <FormSection
              icon={<FaIdCard className="text-gray-500" />}
              label="Aadhaar Number"
              value={
                <input
                  type="text"
                  className={`p-2 border rounded w-full ${
                    !isFinancialEditable() ? "bg-gray-100" : ""
                  }`}
                  value={financialData.adhaar}
                  onChange={(e) =>
                    setFinancialData({
                      ...financialData,
                      adhaar: e.target.value,
                    })
                  }
                  disabled={!isFinancialEditable()}
                  maxLength="12"
                />
              }
            />

            <FormSection
              icon={<FaMobile className="text-gray-500" />}
              label="UPI ID"
              value={
                <input
                  type="text"
                  className={`p-2 border rounded w-full ${
                    !isFinancialEditable() ? "bg-gray-100" : ""
                  }`}
                  value={financialData.upi}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, upi: e.target.value })
                  }
                  disabled={!isFinancialEditable()}
                />
              }
            />

            <FormSection
              icon={<FaUniversity className="text-gray-500" />}
              label="Bank Name"
              value={
                <input
                  type="text"
                  className={`p-2 border rounded w-full ${
                    !isFinancialEditable() ? "bg-gray-100" : ""
                  }`}
                  value={financialData.bankName}
                  onChange={(e) =>
                    setFinancialData({
                      ...financialData,
                      bankName: e.target.value,
                    })
                  }
                  disabled={!isFinancialEditable()}
                />
              }
            />

            <FormSection
              icon={<FaUniversity className="text-gray-500" />}
              label="IFSC Code"
              value={
                <input
                  type="text"
                  className={`p-2 border rounded w-full ${
                    !isFinancialEditable() ? "bg-gray-100" : ""
                  }`}
                  value={financialData.ifsc}
                  onChange={(e) =>
                    setFinancialData({ ...financialData, ifsc: e.target.value })
                  }
                  disabled={!isFinancialEditable()}
                  maxLength="11"
                />
              }
            />

            <FormSection
              icon={<FaUniversity className="text-gray-500" />}
              label="Bank Account Verification"
              value={
                <div className="space-y-4">
                  <input
                    type="text"
                    className={`p-2 border rounded w-full ${
                      !isFinancialEditable() ? "bg-gray-100" : ""
                    } ${errors.accountMatch ? "border-red-500" : ""}`}
                    placeholder="Enter account number"
                    value={financialData.bankAC}
                    onChange={(e) => {
                      setFinancialData({
                        ...financialData,
                        bankAC: e.target.value,
                      });
                      setErrors({ ...errors, accountMatch: "" });
                    }}
                    disabled={!isFinancialEditable()}
                  />
                  <input
                    type="text"
                    className={`p-2 border rounded w-full ${
                      errors.accountMatch ? "border-red-500" : ""
                    }`}
                    placeholder="Re-enter account number"
                    value={confirmAccount}
                    onChange={(e) => {
                      setConfirmAccount(e.target.value);
                      setErrors({ ...errors, accountMatch: "" });
                    }}
                    disabled={!isFinancialEditable()}
                  />
                  {errors.accountMatch && (
                    <p className="text-red-500 text-sm">
                      {errors.accountMatch}
                    </p>
                  )}
                </div>
              }
            />

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowFinancialConfirm(true)}
                disabled={!isFinancialEditable()}
                className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                  !isFinancialEditable()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FaSave className="mr-2" />
                {!isFinancialEditable()
                  ? "Financial Details Locked"
                  : "Save Financial Information"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Confirmation Modal */}
      {showFinancialConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Financial Details
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to submit these financial details? You won't
              be able to modify them again.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowFinancialConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFinancialSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormSection = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="mr-3 mt-3 text-lg">{icon}</span>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {value}
    </div>
  </div>
);

export default EditProfile;
