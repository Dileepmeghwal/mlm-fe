// src/components/WithdrawAmount.jsx

import React, { useState, useContext } from "react";
import {
  extractNumber,
  getRequest,
  getUserId,
  postRequest,
} from "../config/api";
import { AuthContext } from "../context/AuthContext";
import {
  FaUser,
  FaWallet,
  FaPercentage,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const WithdrawAmount = () => {
  const [userId, setUserId] = useState("");
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [amount, setAmount] = useState("");
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleVerifyUser = async () => {
    setVerifiedUser(null);
    setVerificationError("");
    setCalculationResult(null);

    if (!userId.trim()) {
      setVerificationError("Please enter a User ID.");
      return;
    }

    const extractedNumber = extractNumber(userId);

    if (extractedNumber === null) {
      setVerificationError(
        "Invalid User ID. Please enter a valid ID (e.g., DTF0002)."
      );
      return;
    }
    setLoading(true);

    try {
      const response = await getRequest(`/user/get-user/${extractedNumber}`);
      if (response.data) {
        setVerifiedUser(response.data);
      } else {
        setVerificationError("No data found for the provided User ID.");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setVerificationError("An error occurred while verifying the user.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTax = async () => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount)) {
      setVerificationError("Please enter a valid amount.");
      return;
    }
    if (numericAmount < 500) {
      setVerificationError("Amount should not be less than 500");
      return;
    }
    if (numericAmount > (verifiedUser?.wallet ?? 0)) {
      setVerificationError("Amount should not be more than wallet balance.");
      return;
    }

    setLoading(true);

    try {
      const response = await getRequest(
        `/user/calculate-amount?amount=${amount}&userId=${verifiedUser?._id}`
      );
      setCalculationResult(response.data);
    } catch (error) {
      console.error("Error calculating tax:", error);
      setVerificationError("Failed to calculate tax. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("Are you sure you want to process this withdrawal?")) {
      setLoading(true);
      try {
        await postRequest("/user/withdraw", {
          userId: verifiedUser._id,
          amount: calculationResult.total,
        });
        toast.success("Withdrawal processed successfully!");
        // Reset form
        setUserId("");
        setVerifiedUser(null);
        setAmount("");
        setCalculationResult(null);
      } catch (error) {
        console.error("Withdrawal error:", error);
        toast.error("Failed to process withdrawal. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          <FaMoneyCheckAlt className="inline-block mr-2 text-blue-500" />
          Process Withdrawal
        </h2>

        {/* User Verification Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            User ID:
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter User ID"
            />
            <button
              onClick={handleVerifyUser}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
          {verificationError && (
            <p className="text-red-500 text-sm mt-2">{verificationError}</p>
          )}
        </div>

        {/* Verified User Details */}
        {verifiedUser && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              User Details:
            </h3>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {verifiedUser.first_name} {verifiedUser.last_name}
            </p>
            <p>
              <span className="font-medium">Wallet Balance:</span> ₹
              {verifiedUser.wallet?.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">User ID:</span>{" "}
              {getUserId(verifiedUser.userId)}
            </p>
          </div>
        )}

        {/* Amount Input Section */}
        {verifiedUser && !calculationResult && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Withdrawal Amount:
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter amount"
              />
              <button
                onClick={handleCalculateTax}
                className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </button>
            </div>
          </div>
        )}

        {/* Calculation Results */}
        {calculationResult && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Withdrawal Details
            </h3>

            <div className="space-y-3 border rounded p-4">
              <div className="flex justify-between">
                <span className="font-medium">
                  <FaWallet className="inline-block mr-2" />
                  Requested Amount:
                </span>
                <span>₹{calculationResult.total}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  <FaPercentage className="inline-block mr-2" />
                  TDS (5%)
                </span>
                <span className="text-red-500">
                  - ₹
                  {calculationResult.deduction > 0
                    ? calculationResult.deduction / 2
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  <FaPercentage className="inline-block mr-2" />
                  Platform Charge (5%)
                </span>
                <span className="text-red-500">
                  - ₹
                  {calculationResult.deduction > 0
                    ? calculationResult.deduction / 2
                    : 0}
                </span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-bold">
                <span>Net Withdrawal Amount:</span>
                <span className="text-green-600">
                  ₹{calculationResult.withdrawAmount}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleWithdraw}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawAmount;
