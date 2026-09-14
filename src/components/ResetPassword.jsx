import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { postRequest } from "../config/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

// Mirror of backend password rules (passwordReset.service validatePassword)
const rules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  {
    label: "One special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verify the token as soon as the page loads
  useEffect(() => {
    const verify = async () => {
      if (!token || !email) {
        setTokenError("Invalid reset link. Missing token or email.");
        setChecking(false);
        return;
      }
      try {
        await postRequest("/password-reset/verify-token", { token, email });
        setTokenValid(true);
      } catch (err) {
        setTokenError(
          err?.response?.data?.message ||
            "This reset link is invalid or has expired."
        );
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [token, email]);

  const allRulesPass = rules.every((r) => r.test(newPassword));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allRulesPass) {
      setError("Password does not meet all the requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await postRequest("/password-reset/reset-password", {
        token,
        email,
        newPassword,
        confirmPassword,
      });
      toast.success("Password reset successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-[30px] rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center">Reset Password</h2>

        {checking ? (
          <p className="text-center text-gray-500 text-sm">
            Verifying reset link...
          </p>
        ) : !tokenValid ? (
          <div className="text-center">
            <div className="mb-4 text-red-500 text-sm">{tokenError}</div>
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline text-sm"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Set a new password for <strong>{email}</strong>
            </p>

            {error && (
              <div className="mb-4 text-red-500 text-sm">{error}</div>
            )}

            <div className="mb-3 relative">
              <label className="block mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full border px-3 py-2 rounded pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPass ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block mb-1">Confirm Password</label>
              <input
                type={showPass ? "text" : "password"}
                className="w-full border px-3 py-2 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
              />
            </div>

            <ul className="mb-4 text-xs space-y-1">
              {rules.map((r) => {
                const passed = r.test(newPassword);
                return (
                  <li
                    key={r.label}
                    className={passed ? "text-green-600" : "text-gray-400"}
                  >
                    {passed ? "✓" : "○"} {r.label}
                  </li>
                );
              })}
            </ul>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded disabled:opacity-50"
              disabled={loading || !allRulesPass || newPassword !== confirmPassword}
            >
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
