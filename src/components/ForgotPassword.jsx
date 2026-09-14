import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postRequest } from "../config/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await postRequest("/password-reset/forgot-password", { email });
      // Backend always responds success (no email-existence leak)
      setSent(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-[30px] rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>

        {sent ? (
          <div className="text-center">
            <div className="mb-4 text-green-600 text-sm">
              If an account exists for <strong>{email}</strong>, a password
              reset link has been sent to that email. Please check your inbox
              (and spam folder).
            </div>
            <p className="text-xs text-gray-500 mb-4">
              The reset link is valid for 15 minutes.
            </p>
            <Link to="/" className="text-blue-500 hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your registered email and we'll send you a link to reset
              your password.
            </p>

            {error && (
              <div className="mb-4 text-red-500 text-sm">{error}</div>
            )}

            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="text-blue-500 hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
