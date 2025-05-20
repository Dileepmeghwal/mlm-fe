// src/components/CustomerWithdraw.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { extractNumber, getRequest, postRequest } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { FaWallet, FaPercentage, FaMoneyCheckAlt } from "react-icons/fa";

const CustomerWithdraw = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const id = user?._id;
  console.log(user,"user")
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getRequest(
          `/user/get-by-id/${user._id}`
        );
        if (response.data) {
          setUserDetails(response.data);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (user._id) fetchUserData();
  }, [user]);

  const handleCalculateTax = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }
    if (amount < 500) {
      alert("Amount should not be less than 500");
      return;
    }
    if (amount > userDetails?.wallet) {
      alert("Amount exceeds your wallet balance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getRequest(
        `/user/calculate-amount?amount=${amount}&userId=${userDetails?._id}`
      );
      setCalculationResult(response.data);
    } catch (error) {
      console.error("Error calculating tax:", error);
      setError("Failed to calculate charges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("Are you sure you want to process this withdrawal?")) {
      setLoading(true);
      try {
        await postRequest("/user/withdraw", {
          userId: userDetails._id,
          amount: calculationResult.total,
        });
        alert("Withdrawal processed successfully!");
        // Refresh user data
        const updatedUser = await getRequest(
          `/user/get-by-id/${userDetails._id}`
        );
        setUserDetails(updatedUser.data);
        setAmount("");
        setCalculationResult(null);
      } catch (error) {
        console.error("Withdrawal error:", error);
        alert("Failed to process withdrawal. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !userDetails) {
    return <div className="text-center p-8">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          <FaMoneyCheckAlt className="inline-block mr-2 text-blue-500" />
          Withdraw Funds
        </h2>

        {/* User Details */}
        {userDetails && (
          <div className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Account Summary
            </h3>
            <p className="flex justify-between">
              <span className="font-medium">Available Balance:</span>
              <span>₹{userDetails.wallet?.toFixed(2)}</span>
            </p>
          </div>
        )}

        {/* Amount Input Section */}
        {userDetails && !calculationResult && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Withdrawal Amount:
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Minimum ₹500"
                min="500"
                max={userDetails?.wallet}
              />
              <button
                onClick={handleCalculateTax}
                className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Continue"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        {/* Calculation Results */}
        {calculationResult && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Withdrawal Summary
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
                  - ₹{calculationResult.deduction / 2 || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  <FaPercentage className="inline-block mr-2" />
                  Platform Fee (5%)
                </span>
                <span className="text-red-500">
                  - ₹{calculationResult.deduction / 2 || 0}
                </span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-bold">
                <span>Net Amount:</span>
                <span className="text-green-600">
                  ₹{calculationResult.withdrawAmount}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handleWithdraw}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Withdrawal"}
              </button>
              <button
                onClick={() => setCalculationResult(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerWithdraw;
