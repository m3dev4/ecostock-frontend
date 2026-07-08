import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


instance.interceptors.request.use(
  (config) => {
    try {
      const authStorage = localStorage.getItem("auth");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error setting authorization header", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
