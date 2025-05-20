import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Nav() {
  const [currentPath, setCurrentPath] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setAuthToken, user, setUser, authToken } = useContext(AuthContext);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isActive = (path) => {
    // console.log(currentPath, path);
    return currentPath === path;
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    setIsMenuOpen(false); // Close menu on logout
    // console.log("User logged out");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavItem = ({ to, label }) => (
    <li>
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center justify-between text-sm lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 mb-2 lg:mb-0 lg:mr-6 ${
          isActive(to) ? "text-indigo-700" : "text-gray-500"
        }`}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <nav className="border-solid  border-gray-200 w-full border-b py-3 bg-white z-50 sticky top-0">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between lg:justify-start gap-10 items-center">
          {/* Logo/Brand can be added here */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-700">
              <img src="logo.png" className=" object-cover" width={60} />
            </Link>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden lg:flex ">
            <ul className="flex items-center space-x-6">
              <NavItem to="/" label="Home" />
              {user && authToken && user?.type === "ADMIN" && (
                <>
                  <NavItem to="/create-pin" label="Create Pin" />
                  {/* <NavItem to="/withdraw-amount" label="Withdraw Amount" /> */}
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
              <li>
                {
                  user && authToken && (
                    <button
                      onClick={handleLogout}
                      className="text-sm lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 text-gray-500"
                    >
                      Logout
                    </button>
                  )
                  // : (
                  //   <Link
                  //     to="/login"
                  //     className="text-sm lg:text-base font-medium hover:text-indigo-700 transition-all duration-500 text-gray-500"
                  //   >
                  //     Login
                  //   </Link>
                  // )
                }
              </li>
              {(!user || !authToken) && <NavItem to="/signup" label="New Registration" />}
            </ul>
          </div>

          {/* Mobile Menu Button - Hidden on desktop */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-indigo-700 focus:outline-none"
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
            <ul className="flex flex-col space-y-3">
              <NavItem to="/" label="Home" />
              {user && authToken && user?.type === "ADMIN" && (
                <>
                  <NavItem to="/create-pin" label="Create Pin" />
                  {/* <NavItem to="/withdraw-amount" label="Withdraw Amount" /> */}
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
              <li>
                {user && authToken ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm font-medium hover:text-indigo-700 transition-all duration-500 text-gray-500 py-2"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-medium hover:text-indigo-700 transition-all duration-500 text-gray-500 py-2"
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
