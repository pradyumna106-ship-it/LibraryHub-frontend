import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1", // 🔥 change if needed
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;