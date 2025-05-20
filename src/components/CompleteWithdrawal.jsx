import { useState, useEffect } from "react";
import { getRequest } from "../config/api";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CompletedWithdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchCompletedWithdrawals = async () => {
      try {
        const response = await getRequest("/admin-withdraw/complete");
        setWithdrawals(response.data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedWithdrawals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Completed Withdrawals
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Request Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal._id}
                  className="hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigation("/userDetails", {
                      state: { userId: withdrawal?.user?._id },
                    });
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {withdrawal.user?.first_name[0]}
                          {withdrawal.user?.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {withdrawal.user?.first_name}{" "}
                          {withdrawal.user?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {withdrawal.user?.mobile_number}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {withdrawal.user?.email}
                  </td>
                  <td className="px-6 py-4 font-medium text-green-600">
                    ₹{withdrawal.withdrawAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {withdrawals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No completed withdrawals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedWithdraw;
