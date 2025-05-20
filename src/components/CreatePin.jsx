// src/components/CreatePin.jsx

import React, { useState, useContext } from "react";
import { getRequest, getUserId, postRequest } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaClipboard, FaCheckCircle } from "react-icons/fa";



// Utility function to extract number from string
function extractNumber(str) {
  const match = str.match(/\d+/); // Matches continuous digits
  if (match) {
    return parseInt(match[0], 10); // Converts "002" to 2
  }
  return null;
}



const CreatePin = () => {
  const [userId, setUserId] = useState("");
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [count, setCount] = useState(1); // New count state
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleVerifyUser = async () => {
    setVerifiedUser(null);
    setVerificationError("");
    setSubmitMessage("");

    if (!userId.trim()) {
      setVerificationError("Please enter a User ID.");
      return;
    }

    // Extract number from userId
    const extractedNumber = extractNumber(userId);

    if (extractedNumber === null) {
      setVerificationError("Invalid User ID. Please enter a valid ID (e.g., DTF0002).");
      return;
    }

    setLoading(true);

    try {
      const response = await getRequest(`/user/get-user/${extractedNumber}`);
      if (response.data) {
        setVerifiedUser(response.data);
        fetchPlans();
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

  const fetchPlans = async () => {
    try {
      const response = await getRequest("/plan/get");
      if (response.data) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setVerificationError("Failed to fetch plans. Please try again later.");
    }
  };

  const handleCreatePin = async (e) => {
    e.preventDefault();
    setSubmitMessage("");

    if (!verifiedUser) {
      setVerificationError("Please verify a user before creating PINs.");
      return;
    }

    if (!selectedPlan) {
      setVerificationError("Please select a plan.");
      return;
    }

    setLoading(true);

    try {
      const response = await postRequest("/plan-pin/create", {
        createdFrom: verifiedUser._id,
        plan: selectedPlan,
        count: count, // Send count to API
      });

      if (response.data) {
        setSubmitMessage(
          `${count} ${
            count === 1 ? "PIN" : "PINs"
          } created and transferred to user`
        );
      } else {
        setVerificationError("Failed to create PINs. Please try again.");
      }
    } catch (error) {
      console.error("Error creating PINs:", error);
      setVerificationError("An error occurred while creating the PINs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          <FaClipboard className="inline-block mr-2 text-blue-500" />
          Create PIN
        </h2>

        <div className="mb-6">
          <label
            htmlFor="userId"
            className="block text-gray-700 font-semibold mb-2"
          >
            User ID:
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="userId"
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

        {verifiedUser && (
          <div className="mb-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              User Details:
            </h3>
            <p>
              <span className="font-medium">First Name:</span>{" "}
              {verifiedUser.first_name}
            </p>
            <p>
              <span className="font-medium">Last Name:</span>{" "}
              {verifiedUser.last_name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {verifiedUser.email}
            </p>
            <p>
              <span className="font-medium">User ID:</span> {" "}
              {getUserId(verifiedUser.userId)}
            </p>
          </div>
        )}

        {verifiedUser && (
          <form onSubmit={handleCreatePin}>
            <div className="mb-4">
              <label
                htmlFor="plan"
                className="block text-gray-700 font-semibold mb-2"
              >
                Select Plan:
              </label>
              <select
                id="plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">-- Choose a Plan --</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="count"
                className="block text-gray-700 font-semibold mb-2"
              >
                Number of PINs:
              </label>
              <input
                type="number"
                id="count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min="1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Creating PINs..." : "Create PINs"}
              </button>
            </div>
          </form>
        )}

        {submitMessage && (
          <div className="mt-6 text-center">
            <FaCheckCircle className="inline-block mr-2 text-green-500" />
            <p className="text-green-500 font-semibold">{submitMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePin;
