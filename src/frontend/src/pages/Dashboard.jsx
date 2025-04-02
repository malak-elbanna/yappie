import { useNavigate } from "react-router-dom";
import { logout } from "../Api";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full">
                <h1 className="text-white text-3xl font-bold text-center mb-6">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    Manage your account and explore features.
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
