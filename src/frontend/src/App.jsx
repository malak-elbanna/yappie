import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </Router>
  );
};

export default App;
