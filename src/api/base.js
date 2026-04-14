import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Member Login
export const memberLogin = (data) => API.post("/member/login", data);

// ✅ Admin Login
export const adminLogin = (data) => API.post("/admin/login", data);

export default API;