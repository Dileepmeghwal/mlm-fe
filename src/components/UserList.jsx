import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getRequest, getUserId } from "../config/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getRequest(
          `/user/get-list?page=${currentPage}&limit=20`
        );
        setUsers(response.data);
        // console.log(response.headers);
        if (response.headers && response.headers["x-pagination"]) {
          try {
            let paginationData = JSON.parse(response.headers["x-pagination"]);
            setPagination(paginationData);
          } catch (e) {
            console.warn("Failed to parse x-pagination header", e);
          }
        } else {
          console.warn("No x-pagination header found in response");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
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
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          User Management
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Wallet
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {getUserId(user.userId)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.mobile_number || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₹{user.wallet.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/userDetails`}
                      state={{ userId: user._id }} // Pass userId in state
                      className="inline-flex text-nowrap items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {pagination.totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className={`flex items-center px-4 py-2 rounded-md ${
                pagination.hasPreviousPage
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <FaArrowLeft className="mr-2" />
              Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center px-4 py-2 rounded-md ${
                pagination.hasNextPage
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              Next
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
