// src/components/ReferredUserList.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRequest } from "../config/api";
import moment from "moment";

const ReferredUserList = () => {
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const [levelName, setLevelName] = useState("");
  const navigate = useNavigate();

  // Get level ID and name from query parameters
  const queryParams = new URLSearchParams(location.search);
  const levelId = queryParams.get("level");

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await getRequest(`/user/referrals?level=${levelId}`);
        if (response.data?.length) {
          setLevelName(response.data[0].planLevel.levelName);
          setReferrals(response.data);
        }
      } catch (err) {
        setError("Failed to fetch referrals", res?.data?.length);
        console.error("Error fetching referrals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (levelId) {
      fetchReferrals();
    } else {
      setError("Level ID not provided");
      setIsLoading(false);
    }
  }, [levelId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header with Level Name */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {levelName || "Referral"} Referral Users
            </h1>
            <p className="text-gray-600 mt-2">
              List of users referred under this level
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading referrals...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Referral Table */}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrals.map((referral, index) => (
                    <tr key={referral._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {referral.referredUser.first_name || "-"}{" "}
                        {referral.referredUser.last_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap ">
                        {referral?.referredUser?.mobile_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(referral.createdAt).format(
                          "MMM D, YYYY h:mm A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {referrals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No referrals found for this level
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferredUserList;
