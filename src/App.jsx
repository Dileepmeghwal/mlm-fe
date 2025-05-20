// src/App.js
import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  // useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyAccount from "./components/VerifyAccount"; // Import the new component

import { AuthContext } from "./context/AuthContext"; // Import AuthContext
import CreatePin from "./components/CreatePin";
import Nav from "./components/nav";
import Notifications from "./components/Notifications";
import RootNavigation from "./components/routes";

const App = () => {

  return (
    <Router>
      <div className="min-h-screen bg-gray-800">
        <Nav />
        <RootNavigation/>
      </div>
    </Router>
  );
};

export default App;
