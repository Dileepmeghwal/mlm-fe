import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getRequest } from "../config/api";
import { VscLoading } from "react-icons/vsc";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (token) => {
    try {
      setLoading(true);
      const response = await getRequest("/user/token");
      // console.log("User data:", response.data);
      setUser(response.data);
      setAuthToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("authToken");
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    // console.log("token", token);
    if (token) {
      fetchUserData(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, user, setUser }}>
      {loading ? (
        <div className="w-full h-full m-12 flex justify-center items-center">
          <VscLoading size={32} className="animate-spin w-12 h-12" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
