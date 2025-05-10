import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../Api";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState("");

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
            sessionStorage.setItem("access_token", accessToken);
            sessionStorage.setItem("refresh_token", refreshToken);

            navigate("/dashboard", { replace: true });
        }

        try {
            const token = sessionStorage.getItem("access_token");
            if (token) {
                const payloadBase64 = token.split(".")[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                const userId = decodedPayload.sub;
                setValue(userId);
            }
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }, [location.search, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full">
                <h1 className="text-white text-3xl font-bold text-center mb-6">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    {value ? `User ID: ${value}` : "Loading user info..."}
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
