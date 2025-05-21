import React, { useState, useEffect, useContext } from "react";
import {
  extractNumber,
  getRequest,
  getUserId,
  postRequest,
} from "../config/api";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
} from "react-icons/fa";

const PlanPinManagement = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPinId, setShowPinId] = useState(null);
  const [transferModal, setTransferModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [userId, setUserId] = useState("");
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await getRequest("/plan-pin/user");
        if (response.data) {
          setPins(response.data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch plan pins");
        console.error("Error fetching pins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset tooltip after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const handleVerifyUser = async () => {
    setVerifiedUser(null);
    setVerificationError("");

    if (!userId.trim()) {
      setVerificationError("Please enter a User ID");
      return;
    }

    const extractedNumber = extractNumber(userId);

    if (extractedNumber === null) {
      setVerificationError(
        "Invalid User ID. Please enter a valid ID (e.g., DTF0002)."
      );
      return;
    }

    try {
      const response = await getRequest(`/user/get-user/${extractedNumber}`);
      if (response.data) {
        setVerifiedUser(response.data);
      } else {
        setVerificationError("User not found");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationError("Error verifying user");
    }
  };

  const handleTransfer = async () => {
    setTransferLoading(true);
    try {
      await postRequest("/plan-pin/transfer", {
        userId: verifiedUser._id,
        pin: selectedPin._id,
      });

      // Refresh pins after successful transfer
      const response = await getRequest("/plan-pin/user");
      setPins(response.data);
      setTransferModal(false);
      alert("PIN transferred successfully");
      setError("");
      setSelectedPin(null);
      setVerifiedUser(null);
      setVerificationError("");
      setUserId("");
    } catch (error) {
      console.error("Transfer error:", error);
      setVerificationError(error?.response?.data?.message || "Transfer failed");
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Plan PIN Management</h2>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading PINs...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b">#</th>
                    <th className="py-3 px-4 border-b">Plan Name</th>
                    <th className="py-3 px-4 border-b">PIN</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Created At</th>
                    <th className="py-3 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pins.map((pin, index) => (
                    <tr key={pin._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b text-center">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        {pin.plan.name}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        <div
                          className={`flex items-center justify-center gap-2 relative `}
                        >
                          {/* Display pin or masked version */}
                          {showPinId === pin._id ? pin.pin : "••••••"}

                          {/* Show/Hide Button */}
                          <button
                            onClick={() =>
                              setShowPinId(
                                showPinId === pin._id ? null : pin._id
                              )
                            }
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={
                              showPinId === pin._id ? "Hide PIN" : "Show PIN"
                            }
                          >
                            {showPinId === pin._id ? <FaEyeSlash /> : <FaEye />}
                          </button>

                          {/* Copy Button */}
                          <CopyButton pin={pin.pin} />
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        {pin.used ? (
                          <span className="text-red-600 flex items-center justify-center gap-1">
                            <FaTimesCircle /> Used
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center justify-center gap-1">
                            <FaCheckCircle /> Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        {moment(pin.createdAt).format("MMM D, YYYY")}
                      </td>
                      <td className="py-3 px-4 border-b text-center">
                        {!pin.used && (
                          <button
                            onClick={() => {
                              setSelectedPin(pin);
                              setTransferModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          >
                            Transfer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Transfer PIN</h3>

            <div className="mb-4">
              <label className="block mb-2">User ID:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="border rounded p-2 flex-1"
                  placeholder="Enter User ID"
                />
                <button
                  onClick={handleVerifyUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Verify
                </button>
              </div>
              {verificationError && (
                <p className="text-red-500 text-sm mt-2">{verificationError}</p>
              )}
            </div>

            {verifiedUser && (
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <p className="font-semibold">Verified User:</p>
                <p>
                  {verifiedUser.first_name} {verifiedUser.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {getUserId(verifiedUser.userId)}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setTransferModal(false);
                  setVerifiedUser(null);
                  setUserId("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!verifiedUser || transferLoading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {transferLoading ? "Transferring..." : "Confirm Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanPinManagement;

function CopyButton({ pin }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset tooltip after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Copy PIN"
      >
        <FaCopy />
      </button>
      {copied && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
          Copied!
        </span>
      )}
    </div>
  );
}
