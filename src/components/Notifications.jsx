// src/components/Notifications.jsx

import React, { useEffect, useState } from "react";
import { getRequest } from "../config/api";
import moment from "moment";
import { FaBell, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getRequest("/notification/get");
        setNotifications(data.data);
      } catch (err) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-600 animate-pulse">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <FaBell className="text-2xl text-blue-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Notifications</h1>
            <p className="text-lg opacity-90">Stay updated with the latest alerts</p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto -mt-8 px-6 pb-10">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <FaExclamationCircle className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No notifications available.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <FaCheckCircle className="text-green-500 mt-1 mr-4 text-xl" />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {moment(notification.createdAt).fromNow()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;