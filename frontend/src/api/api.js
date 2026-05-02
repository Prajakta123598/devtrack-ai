import axios from "axios";

// 👇 Auto switch (local vs deployed)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

export default API;