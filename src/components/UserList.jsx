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
          `/user/get-list?page=${currentPage}&limit=10`
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
    <div className="p-4 sm:p-6 container mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
          User Management
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700" scope="col">
                  #
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700" scope="col">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 hidden sm:table-cell" scope="col">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 hidden md:table-cell" scope="col">
                  Phone
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700" scope="col">
                  Plan
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700 hidden lg:table-cell" scope="col">
                  Wallet
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-medium text-gray-700" scope="col">
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
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">{(index + 1) + (currentPage - 1) * 10}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xs sm:text-sm">
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ID: {getUserId(user.userId)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 sm:hidden mt-1">
                          {user.email}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 md:hidden mt-1">
                          {user.mobile_number || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 hidden md:table-cell">
                    {user.mobile_number || "N/A"}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium hidden lg:table-cell">
                    ₹{user.wallet.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <Link
                      to="/userDetails"
                      state={{ userId: user._id }}
                      className="inline-flex text-nowrap items-center px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors text-xs sm:text-sm min-h-[40px] w-full sm:w-auto justify-center"
                      aria-label={`View details for ${user.first_name} ${user.last_name}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
              <svg
                className="mx-auto h-8 w-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              No users found
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 px-2 sm:px-4 gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-700">
            Page {currentPage} of {pagination.totalPages}
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className={`flex items-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm min-h-[40px] w-full sm:w-auto justify-center ${
                pagination.hasPreviousPage
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Previous page"
            >
              <FaArrowLeft className="mr-1 sm:mr-2 text-xs sm:text-sm" />
              Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm min-h-[40px] w-full sm:w-auto justify-center ${
                pagination.hasNextPage
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Next page"
            >
              Next
              <FaArrowRight className="ml-1 sm:ml-2 text-xs sm:text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
