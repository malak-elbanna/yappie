import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"; 

export const login = async (email, password) => {
    return axios.post(`${API_URL}/user-service/auth/login`, { email, password });
};

export const login_admin = async (email, password) => {
    return axios.post(`${API_URL}/user-service/auth/login-admin`, { email, password });
};

export const register = async (email, password, name) => {
    return axios.post(`${API_URL}/user-service/auth/register`, { email, password, name });
};

export const googleLogin = async () => {
    window.location.href = `${API_URL}/user-service/auth/google-login`;
};

export const logout = async () => {
    const token = localStorage.getItem("token"); 
    if (token) {
        try {
            await axios.post(
                `${API_URL}/user-service/auth/logout`,
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"  
                    },
                }
            );
            
            localStorage.removeItem("token"); 
        } catch (err) {
            console.error("Logout failed", err);
            throw err; 
        }
    } else {
        console.warn("No token found in localStorage");
    }
};
