import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories'; // Adjust the path if necessary

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import Categories from "./pages/Categories"; // Import the Categories component


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Categories />} /> {/* Dynamic route for categories */}
        <Route path="/category/:category" element={<Categories />} />
      </Routes>
    </Router>
  );
};

export default App;