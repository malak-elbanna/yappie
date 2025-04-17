import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../Api";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));

    useEffect(() => {
        setIsLoggedIn(!!sessionStorage.getItem("token"));
    }, [location]); 

    const handleLogout = async () => {
        try {
            await logout(); 
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
                    <div className="flex items-center mr-6">
                        <span className="font-bold text-xl ml-2">YAPPIE</span>
                    </div>
                    <nav className="md:flex space-x-6">
                        <a href="/" className="hover:text-purple-400">Home</a>
                        <a href="/books" className="hover:text-purple-400">Books</a>
                        <a href="/categories" className="hover:text-purple-400">Categories</a>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <>
                            <button 
                                onClick={() => navigate("/signup")}
                                className="md:block hover:text-purple-400"
                            >
                                Sign up
                            </button>
                            <button 
                                onClick={() => navigate("/login")}
                                className="md:block hover:text-purple-400"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="md:block hover:text-purple-400"
                        >
                            Logout
                        </button>
                    )}
                    <button className="bg-purple-700 hover:bg-purple-800 text-white py-1 px-4 rounded">
                        Subscribe
                    </button>
                </div>
            </div>
        </header>
    );
}
