import { useState, useEffect } from "react";
import {
  FaUsers,
  FaMoneyCheckAlt,
  FaFileInvoice,
  FaCalendarAlt,
  FaSpinner,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import moment from "moment";
import { getRequest, getUserId } from "../config/api";

// const DashboardPage = () => {
//   const [summaryData, setSummaryData] = useState(null);
//   const [userData, setUserData] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState("week");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const summaryResponse = await getRequest("/admin/get");
//         setSummaryData(summaryResponse.data);

//         // Calculate dates based on filter
//         const { startDate, endDate } = calculateDates(selectedFilter);
//         const userResponse = await getRequest(
//           `/admin/get-user?startDate=${startDate}&endDate=${endDate}`
//         );

//         setUserData(userResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedFilter]);

//   const calculateDates = (filter) => {
//     const now = moment();
//     let startDate, endDate;

//     switch (filter) {
//       case "week":
//         startDate = now.clone().subtract(1, "weeks").format("YYYY-MM-DD");
//         break;
//       case "month":
//         startDate = now.clone().subtract(1, "months").format("YYYY-MM-DD");
//         break;
//       case "three-months":
//         startDate = now.clone().subtract(3, "months").format("YYYY-MM-DD");
//         break;
//       default:
//         startDate = now.clone().subtract(1, "weeks").format("YYYY-MM-DD");
//     }

//     endDate = now.format("YYYY-MM-DD");
//     return { startDate, endDate };
//   };

//   const handleFilterChange = (filter) => {
//     setSelectedFilter(filter);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <FaSpinner className="animate-spin text-4xl text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Referrals</p>
//               <p className="text-2xl font-bold">
//                 {summaryData?.referralCode?.total || 0}
//               </p>
//             </div>
//             <FaUsers className="text-3xl text-blue-500 bg-blue-100 p-2 rounded-full" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Used Referrals</p>
//               <p className="text-2xl font-bold">
//                 {summaryData?.referralCode?.used || 0}
//               </p>
//             </div>
//             <FaFileInvoice className="text-3xl text-green-500 bg-green-100 p-2 rounded-full" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Unused Referrals</p>
//               <p className="text-2xl font-bold">
//                 {summaryData?.referralCode?.unused || 0}
//               </p>
//             </div>
//             <FaFileInvoice className="text-3xl text-yellow-500 bg-yellow-100 p-2 rounded-full" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Amount</p>
//               <p className="text-2xl font-bold">
//                 ₹{summaryData?.totalAmount?.totalAmount?.toLocaleString() || 0}
//               </p>
//             </div>
//             <FaMoneyCheckAlt className="text-3xl text-purple-500 bg-purple-100 p-2 rounded-full" />
//           </div>
//         </div>
//       </div>

//       {/* User Registrations Section */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">User Registrations</h2>
//           <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//             {["week", "month", "three-months"].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => handleFilterChange(filter)}
//                 className={`px-4 py-2 rounded-md text-sm ${
//                   selectedFilter === filter
//                     ? "bg-white shadow-sm text-blue-500"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {filter.replace("-", " ").toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>

//         {userData.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             No users found for the selected period
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     #
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Plan
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Referred By
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {userData.map((item, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4">{index + 1}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div>
//                           <p className="font-medium">
//                             {item.user.first_name} {item.user.last_name}
//                           </p>
//                           <span>
//                             {" "}
//                             <p className="text-sm text-gray-500">
//                               User ID: {getUserId(item?.user?.userId)}
//                             </p>
//                           </span>
//                           <p className="text-sm text-gray-500">
//                             {item.user.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-gray-900">{item.plan.name}</p>
//                       <p className="text-sm text-gray-500">
//                         ₹{item.plan.enrollAmount}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4">
//                       {item.createdFrom.first_name} {item.createdFrom.last_name}
//                       <p className="text-sm text-gray-500">
//                         User ID: {getUserId(item.createdFrom.userId)}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4">
//                       {moment(item.updatedAt).format("DD MMM YYYY")}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const summaryResponse = await getRequest("/admin/get");
        setSummaryData(summaryResponse.data);

        // Calculate dates based on filter
        const { startDate, endDate } = calculateDates(selectedFilter);
        const userResponse = await getRequest(
          `/admin/get-user?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&limit=10`
        );

        setUserData(userResponse.data);
        setPagination(userResponse.pagination || { totalPages: 1, hasNextPage: false, hasPreviousPage: false });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter, currentPage]);

  const calculateDates = (filter) => {
    const now = moment();
    let startDate, endDate;

    switch (filter) {
      case "week":
        startDate = now.clone().subtract(1, "weeks").format("YYYY-MM-DD");
        break;
      case "month":
        startDate = now.clone().subtract(1, "months").format("YYYY-MM-DD");
        break;
      case "three-months":
        startDate = now.clone().subtract(3, "months").format("YYYY-MM-DD");
        break;
      default:
        startDate = now.clone().subtract(1, "weeks").format("YYYY-MM-DD");
    }

    endDate = now.format("YYYY-MM-DD");
    return { startDate, endDate };
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

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
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold">
                {summaryData?.referralCode?.total || 0}
              </p>
            </div>
            <FaUsers className="text-3xl text-blue-500 bg-blue-100 p-2 rounded-full" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-2 md:items-center justify-betwee">
            <div>
              <p className="text-gray-500 text-sm">Used Referrals</p>
              <p className="text-2xl font-bold">
                {summaryData?.referralCode?.used || 0}
              </p>
            </div>
            <FaFileInvoice className="text-3xl text-green-500 bg-green-100 p-2 rounded-full" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-2 md:items-center justify-betwee">
            <div>
              <p className="text-gray-500 text-sm">Unused Referrals</p>
              <p className="text-2xl font-bold">
                {summaryData?.referralCode?.unused || 0}
              </p>
            </div>
            <FaFileInvoice className="text-3xl text-yellow-500 bg-yellow-100 p-2 rounded-full" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{summaryData?.totalAmount?.totalAmount?.toLocaleString() || 0}
              </p>
            </div>
            <FaMoneyCheckAlt className="text-3xl text-purple-500 bg-purple-100 p-2 rounded-full" />
          </div>
        </div>
      </div>

      {/* User Registrations Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold">User Registrations</h2>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {["week", "month", "three-months"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm ${
                  selectedFilter === filter
                    ? "bg-white shadow-sm text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {filter.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {userData.length === 0 ? (
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
            No users found for the selected period
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" scope="col">
                      #
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" scope="col">
                      User
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell" scope="col">
                      Plan
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell" scope="col">
                      Referred By
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" scope="col">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{index + 1}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              {item.user.first_name} {item.user.last_name}
                            </p>
                            <span>
                              <p className="text-xs sm:text-sm text-gray-500">
                                User ID: {getUserId(item?.user?.userId)}
                              </p>
                            </span>
                            <p className="text-xs sm:text-sm text-gray-500 sm:hidden">
                              {item.user.email}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 sm:hidden mt-1">
                              {item.plan.name} (₹{item.plan.enrollAmount})
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 md:hidden mt-1">
                              Referred By: {item.createdFrom.first_name} {item.createdFrom.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <p className="text-gray-900 text-sm sm:text-base">{item.plan.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ₹{item.plan.enrollAmount}
                        </p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <p className="text-sm sm:text-base">
                          {item.createdFrom.first_name} {item.createdFrom.last_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          User ID: {getUserId(item.createdFrom.userId)}
                        </p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">
                        {moment(item.updatedAt).format("DD MMM YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;