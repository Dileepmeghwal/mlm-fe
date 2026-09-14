import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setAuthToken, user, setUser, authToken } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavItem = ({ to, label }) => (
    <li>
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center justify-between text-sm sm:text-base font-medium hover:text-indigo-700 transition-all duration-300 py-2 sm:py-3 px-3 sm:px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isActive(to) ? "text-indigo-700 bg-indigo-50" : "text-gray-500"
        }`}
        aria-current={isActive(to) ? "page" : undefined}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <nav className="border-solid border-gray-200 w-full border-b py-3 bg-white z-50 sticky top-0">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between lg:justify-start gap-6 sm:gap-10 items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-700">
              <img src="logo.png" className="object-cover" width={60} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden lg:flex">
            <ul className="flex items-center space-x-4 sm:space-x-6">
              <NavItem to="/" label="Home" />
              {user && authToken && user?.type === "ADMIN" && (
                <>
                  <NavItem to="/create-pin" label="Create Pin" />
                  <NavItem to="/user-list" label="User List" />
                  <NavItem to="/pendingWithdrawal" label="Pending Withdrawal" />
                </>
              )}
              {user && authToken && user?.type !== "ADMIN" && (
                <>
                  <NavItem to="/notification" label="Notification" />
                  <NavItem to="/withdraw-user" label="Withdrawal" />
                </>
              )}
              {user && authToken && (
                <NavItem to="/pin-management" label="Manage Pin" />
              )}
              {user && authToken && user?.type === "ADMIN" && (
                <NavItem to="/admin-profile" label="Profile" />
              )}
              <li>
                {user && authToken && (
                  <LogoutConfirmation setAuthToken={setAuthToken} setIsMenuOpen={setIsMenuOpen} />
                )}
              </li>
              {(!user || !authToken) && <NavItem to="/signup" label="New Registration" />}
            </ul>
          </div>

          {/* Mobile Menu Button - Hidden on desktop */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Shows when toggled */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-2">
              <NavItem to="/" label="Home" />
              {user && authToken && user?.type === "ADMIN" && (
                <>
                  <NavItem to="/create-pin" label="Create Pin" />
                  <NavItem to="/user-list" label="User List" />
                  <NavItem to="/pendingWithdrawal" label="Pending Withdrawal" />
                </>
              )}
              {user && authToken && user?.type !== "ADMIN" && (
                <>
                  <NavItem to="/notification" label="Notification" />
                  <NavItem to="/withdraw-user" label="Withdraw" />
                </>
              )}
              {user && authToken && (
                <NavItem to="/pin-management" label="Manage Pin" />
              )}
              {user && authToken && user?.type === "ADMIN" && (
                <NavItem to="/admin-profile" label="Profile" />
              )}
              <li>
                {user && authToken ? (
                  <LogoutConfirmation setAuthToken={setAuthToken} setIsMenuOpen={setIsMenuOpen} />
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm sm:text-base font-medium hover:text-indigo-700 transition-all duration-300 py-2 px-3 sm:px-4 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-current={isActive("/login") ? "page" : undefined}
                  >
                    Login
                  </Link>
                )}
              </li>
              {(!user || !authToken) && <NavItem to="/signup" label="Signup" />}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

const LogoutConfirmation = ({ setAuthToken, setIsMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    setIsMenuOpen(false);
    setIsOpen(false);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm sm:text-base font-medium hover:text-indigo-700 transition-all duration-300 py-2 px-3 sm:px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-500"
      >
        Logout
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3 sm:space-x-4">
              <button
                onClick={closeModal}
                className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors min-h-[40px] text-sm sm:text-base"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors min-h-[40px] text-sm sm:text-base"
                aria-label="Confirm logout"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};