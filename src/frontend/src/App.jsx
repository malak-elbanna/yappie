import React from "react";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home"; // Import the Home component
import Categories from "./pages/Categories";
import DashboardAdmin from "./pages/DashboardAdmin";
import BooksByCategory from "./pages/BooksByCategory"; // Import the DashboardAdmin component

 // Import the Categories component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />  
        <Route path="/categories" element={<Categories />} /> {/* Dynamic route for categories */}
        <Route path="*" element={<div>Page Not Found</div>} />
        <Route path="/category/:category" element={<BooksByCategory />} /> {/* Dynamic route for categories */}
      </Routes>
    </Router>
  );
};

export default App;