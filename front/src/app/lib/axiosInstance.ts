import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Ensures cookies (including CSRF token) are sent
});

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  console.log("11", document.cookie);
  
  return document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('csrftoken='))
    ?.split('=')[1];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const csrfToken = getCsrfToken(); // Get CSRF token

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (csrfToken) {
      
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
