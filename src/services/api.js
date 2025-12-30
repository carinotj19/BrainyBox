import axios from "axios";

export const isDemo = `${import.meta.env.VITE_DEMO_MODE}` === "true";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE,
});

export const apiUrl = (path = "") => `${API_BASE}${path}`;
