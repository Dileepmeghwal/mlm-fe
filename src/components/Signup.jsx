import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { postRequest } from "../config/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showPass, setShowPass] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (isOtpSent && !isVerified && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOtpSent, isVerified, resendCountdown]);

  const handleSendOtp = async () => {
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);
    setError("");
    try {
      await postRequest("/validate/createOTP", { email });
      setIsOtpSent(true);
      setResendCountdown(20);
      setOtp("");
      setIsVerified(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsVerifyingOtp(true);
    setError("");
    try {
      await postRequest("/validate/verify", { email, otp });
      setIsVerified(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return;

    setLoading(true);
    setError("");
    try {
      const response = await postRequest("/user/signup", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setUser(user);
      navigate("/verify");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPass(!showPass);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-[30px] rounded-md shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 text-center">New Registration</h2>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="John"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Doe"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 border px-3 py-2 rounded"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsOtpSent(false);
                setIsVerified(false);
                setResendCountdown(0);
              }}
              required
              placeholder="you@example.com"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={
                isSendingOtp ||
                (!isOtpSent && !emailRegex.test(email)) ||
                (isOtpSent && !isVerified && resendCountdown > 0) ||
                isVerified
              }
              className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
            >
              {isSendingOtp
                ? "Sending..."
                : isOtpSent
                ? "Resend OTP"
                : "Send OTP"}
            </button>
            {isOtpSent && !isVerified && resendCountdown > 0 && (
              <span className="text-gray-500 self-center">
                in {resendCountdown}s
              </span>
            )}
          </div>
        </div>

        {isOtpSent && (
          <div className="mb-4">
            <label className="block mb-1">Enter OTP</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                className="flex-1 border px-3 py-2 rounded"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit OTP"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isVerifyingOtp || isVerified}
                className="bg-green-500 text-white px-3 py-2 rounded disabled:opacity-50"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        )}

        {/* <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
          />
        </div> */}
        <div className="mb-4 relative">
          <label className="block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full border px-3 py-2 rounded pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPass ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>
          <span className="text-xs text-red-800 italic">
            Please note down your password!
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded disabled:opacity-50"
          disabled={loading || !isVerified}
        >
          {loading ? "Registring..." : "Registration"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
