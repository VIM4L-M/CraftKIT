import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  timeout: 10000
});

export async function getHealth() {
  const response = await api.get("/health");
  return response.data;
}