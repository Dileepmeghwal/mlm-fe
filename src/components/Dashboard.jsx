import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { getRequest, getUserId } from "../config/api";
import { MdOutlineLoop } from "react-icons/md";
import { BsCheckCircleFill, BsFillClockFill } from "react-icons/bs";
import { GiDiamondTrophy } from "react-icons/gi";
import { FiClock } from "react-icons/fi";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaWallet,
  FaChartLine,
  FaLevelUpAlt,
  FaMoneyBillWave,
  FaGift,
  FaUsers,
  FaCreditCard,
  FaCheck,
  FaCross,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaWalkieTalkie } from "react-icons/fa6";
import { VscWarning } from "react-icons/vsc";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState(null);
  const [plans, setPlans] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState("");
  const [error, setError] = useState("");

  function getRank(data) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i]?.count >= data[i]?.planLevel?.bonusTeam) {
        return data[i]?.planLevel?.levelName || "";
      }
    }
  }

  function getRankStatus() {
    const data = levels;

    if (!Array.isArray(data)) {
      return {
        text: "No Data",
        icon: null,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      };
    }

    // console.log("data", data);

    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i]?.count >= data[i]?.planLevel?.bonusTeam) {
        return {
          text: "Achieved",
          icon: <FaCheck />,
          bgColor: "bg-green-50",
          textColor: "text-green-700",
        };
      } else if (
        data[i]?.count > 0 &&
        data[i]?.count < data[i]?.planLevel?.bonusTeam
      ) {
        return {
          text: "Running",
          icon: <MdOutlineLoop />,
          bgColor: "bg-blue-50 ring-1 ring-blue-700/30",
          textColor: "text-blue-700",
        };
      }
    }

    return {
      text: "Not Started",
      icon: null,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    };
  }

  const rankAcheived = useMemo(() => getRank(levels), [levels]);
  const acheivedTitle = useMemo(() => getRankStatus(levels), [levels]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setWallet(user.wallet);
        const plansResponse = await getRequest("/user-plan/get");
        setPlans(plansResponse.data);
        const levelsResponse = await getRequest("/user-level/get");
        setLevels(levelsResponse.data);
        setRank(getRank(levelsResponse.data));
        const userDetails = await getRequest("/user/get-by-id/" + user?._id);
        setWallet(userDetails?.data?.wallet);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-base sm:text-xl font-medium text-gray-600 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-base sm:text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r mb-3 from-purple-600 to-indigo-600 text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start space-x-2 sm:space-x-4">
          <div className="bg-white p-2 rounded-full shadow-lg">
            <FaUser className="text-lg sm:text-2xl text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Hi, {user.first_name} {user.last_name}!
            </h1>
            <p className="text-sm sm:text-base opacity-90 py-1">
              Welcome to your dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto  sm:-mt-8 px-4 sm:px-6 pb-8">
        {/* User and Wallet Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* User Details Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg relative">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center">
              <FaUser className="text-indigo-500 mr-2 text-lg sm:text-xl" />{" "}
              Your Details
            </h2>
            <div className="space-y-3 sm:space-y-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaUser className="text-indigo-500 mr-2 sm:mr-3 text-base sm:text-lg" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Name:
                  </span>
                  <span className="ml-2 text-gray-900 text-sm sm:text-base">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-indigo-500 mr-2 sm:mr-3 text-base sm:text-lg" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    Email:
                  </span>
                  <span className="ml-2 text-gray-900 text-sm sm:text-base">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaIdBadge className="text-indigo-500 mr-2 sm:mr-3 text-base sm:text-lg" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    User ID:
                  </span>
                  <span className="ml-2 text-gray-900 text-sm sm:text-base">
                    {getUserId(user.userId)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mt-4 sm:mt-0 ">
                <GiDiamondTrophy className="text-green-600 text-6xl absolute -top-[20px] right-2 md:relative" />

                <span className="font-semibold text-green-600 text-sm sm:text-base py-2">
                  {rankAcheived}
                </span>
                <p className="mb-4 text-xs sm:text-sm">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${acheivedTitle.bgColor} ${acheivedTitle.textColor} ring-1 ring-inset`}
                  >
                    {acheivedTitle.icon} {acheivedTitle.text}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="mt-4 sm:mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center min-h-[44px] w-full sm:w-auto"
              aria-label="View Profile"
            >
              <FaUser className="mr-2 text-sm sm:text-base" />
              View Profile
            </button>
          </div>

          {/* Wallet Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center">
              <FaWallet className="text-green-500 mr-2 text-lg sm:text-xl" />{" "}
              Wallet
            </h2>
            <div className="flex items-center">
              <FaWallet className="text-green-500 mr-3 sm:mr-4 text-xl sm:text-2xl" />
              <div>
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Balance:
                </span>
                <span className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{wallet ? wallet.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Link
                to="/user/transaction"
                state={{ userId: user._id }}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center min-h-[44px] w-full sm:w-auto"
                aria-label="View Transaction History"
              >
                <FaWalkieTalkie className="mr-2 text-sm sm:text-base" />
                Transaction History
              </Link>
              {wallet >= 500 ? (
                <Link
                  to="/withdraw-user"
                  state={{ userId: user._id }}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center min-h-[44px] w-full sm:w-auto"
                  aria-label="Withdraw Amount"
                >
                  <FaCreditCard className="mr-2 text-sm sm:text-base" />
                  Withdraw Amount
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Plans Opted */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center">
            <FaChartLine className="text-purple-500 mr-2 text-lg sm:text-xl" />{" "}
            Your Plans
          </h2>
          {plans.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">
              No plans opted yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gray-100 p-3 sm:p-4 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <FaChartLine className="text-purple-500 mr-2 sm:mr-3 text-base sm:text-lg" />
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {plan.plan.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Levels */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center">
            <FaLevelUpAlt className="text-blue-500 mr-2 text-lg sm:text-xl" />{" "}
            Performance Levels
          </h2>
          {levels.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">
              No performance data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm sm:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-700 font-semibold">
                      <FaChartLine className="inline mr-1 sm:mr-2 text-purple-500" />{" "}
                      Plan Name
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-700 font-semibold">
                      <FaLevelUpAlt className="inline mr-1 sm:mr-2 text-blue-500" />{" "}
                      Level
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-700 font-semibold">
                      <FaMoneyBillWave className="inline mr-1 sm:mr-2 text-green-500" />{" "}
                      Credit
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-700 font-semibold">
                      <FaGift className="inline mr-1 sm:mr-2 text-indigo-500" />{" "}
                      Bonus
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-700 font-semibold">
                      <FaUsers className="inline mr-1 sm:mr-2 text-gray-500" />{" "}
                      Referrals
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-700 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((level, index) => (
                    <tr
                      key={level._id}
                      className={`cursor-pointer transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                      onClick={() =>
                        navigate(`/referrals?level=${level.planLevel._id}`)
                      }
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">
                        {level.planLevel.plan.name}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800 capitalize">
                        {level.planLevel.levelName}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-600 font-medium">
                        ₹{level.creditAmount}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-indigo-600 font-medium">
                        ₹{level.bonusAmount}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">
                        {level.count}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-800">
                        <StatusBadge
                          count={level?.count}
                          bonusTeam={level?.planLevel?.bonusTeam}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const StatusBadge = ({ count, bonusTeam }) => {
  const getStatusProps = () => {
    if (count >= bonusTeam) {
      return {
        text: "Completed",
        icon: <FaCheck />,
        bgColor: "bg-green-50 ring-1 ring-green-700/30",
        textColor: "text-green-700",
      };
    } else if (count > 0 && count < bonusTeam) {
      return {
        text: "Running",
        icon: <MdOutlineLoop />,
        bgColor: "bg-blue-50 ring-1 ring-blue-700/30",
        textColor: "text-blue-700",
      };
    } else {
      return {
        text: "Incomplete",
        icon: <VscWarning />,
        bgColor: "bg-red-50 ring-1 ring-red-600/30",
        textColor: "text-red-700",
      };
    }
  };

  const { text, icon, bgColor, textColor } = getStatusProps();

  return (
    <span
      className={`${bgColor} ${textColor} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-[1px] ring-inset gap-1 `}
    >
      {icon}
      {text}
    </span>
  );
};
