import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:4000/api/v1", // 🔥 change if needed
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Member Login FUNCTION
export const memberLogin = (data) => {
  return API.post("/member/login", data);
};

// ✅ Admin Login FUNCTION
export const adminLogin = (data) => {
  return API.post("/admin/login", data);
};

export default API;