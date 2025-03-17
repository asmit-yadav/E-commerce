import axios from "axios";

// Token localStorage se get karne ka function
const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:5176/api",
});

// 🔹 Axios Interceptor: Har request ke sath token bhejne ke liye
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
