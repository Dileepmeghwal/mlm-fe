import { useState, useEffect } from "react";
import { getRequest, getUserId, postRequest } from "../config/api";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const PendingWithdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchPendingWithdrawals = async () => {
      try {
        const response = await getRequest("/admin-withdraw/pending");
        setWithdrawals(response.data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this withdrawal?"))
      return;

    try {
      setIsApproving(true);
      await postRequest("/admin-withdraw/update", { id });
      // Refresh the list after approval
      const updated = withdrawals.filter((w) => w._id !== id);
      setWithdrawals(updated);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsApproving(false);
    }
  };

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
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Pending Withdrawals
          </h2>
          <Link
            to={"/completeWithdrawal"}
            className="inline-flex items-center px-2 py-2    text-green-700 rounded-md underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"Show Completed Withdrawal"}
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Account details
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Request Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map((withdrawal, index) => (
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
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {withdrawal.user?.first_name[0]}
                          {withdrawal.user?.last_name[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-900">
                          {withdrawal.user?.first_name}{" "}
                          {withdrawal.user?.last_name}
                        </p>
                         <p>ID: {getUserId(withdrawal?.user?.userId)}</p>
                          <p className="text-sm text-gray-500">
                            {withdrawal.user?.mobile_number}
                          </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className="font-medium text-gray-500">
                      {" "}
                      {withdrawal.user?.bankName}
                    </span>
                    <p>AC: {withdrawal.user?.bankAC}</p>
                    <p>IFSC: {withdrawal.user?.ifsc}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-green-600">
                    ₹{withdrawal.withdrawAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(withdrawal._id);
                      }}
                      disabled={isApproving}
                      className="inline-flex items-center px-4 py-2 bg-purple-600  hover:bg-purple-400 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheckCircle className="mr-2" />
                      {isApproving ? "Approving..." : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {withdrawals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No pending withdrawals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingWithdraw;
