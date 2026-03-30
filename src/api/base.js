import axios from "axios";

// ✅ Member Login FUNCTION
export const memberLogin = (data) => {
  return axios.post("http://localhost:4000/api/v1/member/login", data, {
    "Content-Type": "application/json"
  });
};

// ✅ Admin Login FUNCTION
export const adminLogin = (data) => {
  return axios.post("http://localhost:4000/api/v1/admin/login", data, {
    "Content-Type": "application/json"
  });
};

// export const memberSignUp = (data) => {
//   return axios.post("http://localhost:4000/api/v1/member/login", data, {
//     "Content-Type": "application/json"
//   });
// };

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1", // 🔥 change if needed
  headers: {
    "Content-Type": "application/json"
  }
});



export default API;