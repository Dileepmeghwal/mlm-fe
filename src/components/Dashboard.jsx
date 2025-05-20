// src/components/Dashboard.jsx

import React, { useContext, useEffect, useState } from "react";
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
        console.log("Rank: ", data[i]?.planLevel?.levelName);
        return data[i]?.planLevel?.levelName;
      }
    }
  }

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
        <p className="text-xl font-medium text-gray-600 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  function getAchievedRank(data) {
    const achievedRank = levels.find((item) => item);
    const rank = achievedRank.count === achievedRank.planLevel?.bonusTeam;
    // console.log("achievedRank", achievedRank);

    return achievedRank?.planLevel?.levelName;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="bg-white p-2 rounded-full shadow-lg">
            <FaUser className="text-2xl text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Hi, {user.first_name} {user.last_name}!
            </h1>
            <p className="text-lg opacity-90">Welcome to your dashboard</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto -mt-8 px-6 pb-10">
        {/* User and Wallet Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* User Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
              <FaUser className="text-indigo-500 mr-2" /> Your Details
            </h2>
            <div className="space-y-4 flex md:flex-row flex-col justify-start md:justify-between md:items-center">
              <div>
                <div className="flex items-center">
                  <FaUser className="text-indigo-500 mr-3" />
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-indigo-500 mr-3" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <FaIdBadge className="text-indigo-500 mr-3" />
                  <span className="font-medium text-gray-700">User ID:</span>
                  <span className="ml-2 text-gray-900">
                    {getUserId(user.userId)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <GiDiamondTrophy className="text-green-600" size={40} />
                <span className="font-semibold text-green-600 py-2">
                  {/* {achievedRank} */}
                  {rank}
                </span>
                <p className="mb-4 text-sm">Achieved Rank</p>
              </div>
            </div>
            {/* Added View Profile Button */}
            <button
              onClick={() => navigate("/profile")}
              className="mt-6  bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
            >
              <FaUser className="mr-2" />
              View Profile
            </button>
          </div>

          {/* Wallet Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
              <FaWallet className="text-green-500 mr-2" /> Wallet
            </h2>
            <div className="flex items-center">
              <FaWallet className="text-green-500 mr-4 text-3xl" />
              <div>
                <span className="font-medium text-gray-700">Balance:</span>
                <span className="ml-2 text-3xl font-bold text-gray-900">
                  ₹{wallet ? wallet.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
            <div className="flex justify-start  items-end">
              <Link
                to="/user/transaction"
                state={{
                  userId: user._id,
                }}
                className="mt-6   bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              >
                <FaWalkieTalkie className="mr-2" />
                Transaction History
              </Link>
              {wallet >= 500 ? (
                <Link
                  to="/withdraw-user"
                  state={{
                    userId: user._id,
                  }}
                  className="mt-6  ml-6  bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <FaCreditCard className="mr-2" />
                  Withdraw Amount
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {/* Plans Opted */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
            <FaChartLine className="text-purple-500 mr-2" /> Your Plans
          </h2>
          {plans.length === 0 ? (
            <p className="text-gray-600">No plans opted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gray-100 p-4 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <FaChartLine className="text-purple-500 mr-3" />
                    <span className="font-medium text-gray-800">
                      {plan.plan.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Levels */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
            <FaLevelUpAlt className="text-blue-500 mr-2" /> Performance Levels
          </h2>
          {levels.length === 0 ? (
            <p className="text-gray-600">No performance data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                      <FaChartLine className="inline mr-2 text-purple-500" />{" "}
                      Plan Name
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                      <FaLevelUpAlt className="inline mr-2 text-blue-500" />{" "}
                      Level
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                      <FaMoneyBillWave className="inline mr-2 text-green-500" />{" "}
                      Credit
                    </th>

                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                      <FaGift className="inline mr-2 text-indigo-500" /> Bonus
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                      <FaUsers className="inline mr-2 text-gray-500" />{" "}
                      Referrals
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
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
                      {/* {getAchievedRank(level)} */}
                      <td className="py-3 px-4 text-gray-800">
                        {level.planLevel.plan.name}
                      </td>
                      <td className="py-3 px-4 text-gray-800 capitalize">
                        {level.planLevel.levelName}
                      </td>
                      <td className="py-3 px-4 text-green-600 font-medium">
                        ₹{level.creditAmount}
                      </td>
                      <td className="py-3 px-4 text-indigo-600 font-medium">
                        ₹{level.bonusAmount}
                      </td>
                      <td className="py-3 px-4 text-gray-800">{level.count}</td>
                      <td className="py-3 px-4 text-gray-800">
                        <div className="w-28">
                          {level?.count >= level.planLevel?.bonusTeam ? (
                            // 10 >=10 complete
                            // 1 >10  running
                            <>
                              <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded flex items-center justify-center gap-1">
                                <FaCheck />
                                Completed
                              </span>
                            </>
                          ) : level.count > 1 &&
                            level.count < level.planLevel?.bonusTeam ? (
                            <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded  flex items-center justify-center gap-1">
                              <MdOutlineLoop /> Running
                            </span>
                          ) : (
                            <>
                              <span class="bg-blue-100 text-orange-600 text-xs font-medium me-2 px-2.5 py-0.5 rounded  flex items-center justify-center gap-1">
                                <VscWarning /> Incomplete
                              </span>
                            </>
                          )}
                        </div>
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
