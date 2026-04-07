import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import VerifyAccount from "./VerifyAccount";
import CreatePin from "./CreatePin";
import Notifications from "./Notifications";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";
import DashboardPage from "./AdminDashboard";
import ReferralsList from "./ReferralList";
import PlanPinManagement from "./PlanPinManagement";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import UserProfile from "./UserProfile";
import EditProfile from "./EditProfile";
import AdminEditProfile from "./AdminEditProfile";
import WithdrawAmount from "./WithdrawAmount";
import WithdrawList from "./WithdrawList";
import CustomerWithdraw from "./CustomerWithdraw";
import PendingWithdraw from "./PendingWithdraw";
import CompletedWithdraw from "./CompleteWithdrawal";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

export default function RootNavigation() {
  const { authToken, setAuthToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const publicPaths = ["/forgot-password", "/reset-password"];
    if (!authToken && !publicPaths.includes(location.pathname)) {
      navigate("/");
    }
  }, [authToken]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          authToken && user ? (
            <ProtectedRoute>
              {user?.type == "ADMIN" ? <DashboardPage /> : <Dashboard />}
            </ProtectedRoute>
          ) : (
            <Login />
          )
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyAccount />} /> {/* New Route */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/create-pin"
        element={
          <ProtectedRoute>
            <CreatePin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userDetails"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pendingWithdrawal"
        element={
          <ProtectedRoute>
            <PendingWithdraw />
          </ProtectedRoute>
        }
      />
      <Route
        path="/completeWithdrawal"
        element={
          <ProtectedRoute>
            <CompletedWithdraw />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userDetails/edit"
        element={
          <ProtectedRoute>
            <AdminEditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-list"
        element={
          // <ProtectedRoute>
          <UserList />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          // <ProtectedRoute>
          <DashboardPage />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/notification"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referrals"
        element={
          <ProtectedRoute>
            <ReferralsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pin-management"
        element={
          <ProtectedRoute>
            <PlanPinManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw-amount"
        element={
          <ProtectedRoute>
            <WithdrawAmount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw-user"
        element={
          <ProtectedRoute>
            <CustomerWithdraw />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/transaction"
        element={
          <ProtectedRoute>
            <WithdrawList />
          </ProtectedRoute>
        }
      />
      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.type == "ADMIN" ? <DashboardPage /> : <Dashboard />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
