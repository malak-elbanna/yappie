import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../Api";
import logo from "../assets/logo.png"; 

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = sessionStorage.getItem("access_token");
            setIsLoggedIn(!!accessToken);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            setIsLoggedIn(false);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <header className="bg-black p-4">
            <div className="container mx-auto flex flex-wrap items-center justify-between text-white">

                <div className="flex items-center">
                    <img src={logo} alt="Yappie Logo" className="h-14 w-40 mr-2" />
                </div>

                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>

                <nav
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } md:flex md:items-center md:space-x-6 w-full md:w-auto`}
                >
                    <Link to="/" className="block md:inline-block hover:text-purple-400">
                        Home
                    </Link>
                    <Link to="/books" className="block md:inline-block hover:text-purple-400">
                        Books
                    </Link>
                    <Link to="/categories" className="block md:inline-block hover:text-purple-400">
                        Categories
                    </Link>
                    <Link to="/streams" className="block md:inline-block hover:text-purple-400">
                        Available Streams
                    </Link>
                    <Link to="/about-us" className="block md:inline-block hover:text-purple-400">
                        About Us
                    </Link>
                </nav>

                <div
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } md:flex md:items-center md:space-x-4 w-full md:w-auto`}
                >
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => navigate("/profile")}
                                className="block md:inline-block hover:text-purple-400"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block md:inline-block hover:text-purple-400"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/register")}
                                className="block md:inline-block hover:text-purple-400"
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="block md:inline-block hover:text-purple-400"
                            >
                                Login
                            </button>
                        </>
                    )}
                    <Link
                        to="/subscription"
                        className="block md:inline-block bg-purple-700 hover:bg-purple-800 text-white py-1 px-4 rounded"
                    >
                        Subscribe
                    </Link>
                </div>
            </div>
        </header>
    );
}
