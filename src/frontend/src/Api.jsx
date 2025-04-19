import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
const AUTH_URL = import.meta.env.VITE_AUTH_SERVICE || "http://127.0.0.1:5000";
const STREAMING_URL = import.meta.env.VITE_STREAMING_SERVICE;
const CMS_URL = import.meta.env.VITE_CMS_SERVICE || "http://127.0.0.1:5001";

export const login = async (email, password) => {
  return axios.post(`${API_URL}/${AUTH_URL}/auth/login`, { email, password });
};

export const login_admin = async (email, password) => {
  return axios.post(`${API_URL}/${AUTH_URL}/auth/login-admin`, { email, password });
};

export const register = async (email, password, name) => {
  return axios.post(`${API_URL}/${AUTH_URL}/auth/register`, { email, password, name });
};

export const googleLogin = async () => {
  window.location.href = `${API_URL}/${AUTH_URL}/auth/google-login`;
};

export const logout = async () => {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
    console.error("No token found in sessionStorage.");
    return;
  }

  try {
    await axios.post(
      `${API_URL}/${AUTH_URL}/auth/logout`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    sessionStorage.clear();
  } catch (error) {
    console.error("Logout failed with error:", error);
    throw error;
  }
};

export const get_CMS = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin-cms`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CMS page:", error);
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    throw error;
  }
};

export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/${STREAMING_URL}/books/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const getProfilePage = async(userId) => {
    try {
        const response = await axios.get(`${API_URL}/profile-page/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch profile page: ", error);
        throw error;
    }
}

export const editBio = async (userId, bioData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile-page/${userId}/edit-bio`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bioData)
        });
        return await response.json();
    } catch (error) {
        console.error("error updating bio: ", error);
        throw error;
    }
};

export const addPreference = async (userId, preferenceData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile-page/${userId}/add-preference`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(preferenceData)
        });
        return await response.json();
    } catch (error) {
        console.error("error adding preference: ", error);
        throw error;
    }
}

export const removePreference = async (userId, preferenceData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_URL}/profile-page/${userId}/remove-preference`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(preferenceData)
        });
        return await response.json();
    } catch (error) {
        console.error("error removing preference: ", error);
        throw error;
    }
}