import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const API = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
export default API;