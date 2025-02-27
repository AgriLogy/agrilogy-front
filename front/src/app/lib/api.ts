import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";
const api = axios.create({
  baseURL: API_URL,
});

// Add an interceptor to include the access token in every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add an interceptor to handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status >= 100 && status < 200) {
        // 1xx: Just leave it, no action required
        return Promise.reject(error);
      } else if (status >= 400 && status < 500) {
        // 4xx: Unauthorized or forbidden, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } else if (status >= 500) {
        // 5xx: Server error, redirect to error page
        window.location.href = "/server-error";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
