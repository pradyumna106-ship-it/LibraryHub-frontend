import axios from "axios";

// ✅ Member Login FUNCTION
export const memberLogin = (data) => {
  return API.post("/member/login", data);
};

// ✅ Admin Login FUNCTION
export const adminLogin = (data) => {
  return API.post("/admin/login", data);
};

// export const memberSignUp = (data) => {
//   return axios.post("http://localhost:4000/api/v1/member/login", data, {
//     "Content-Type": "application/json"
//   });
// };

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



export default API;