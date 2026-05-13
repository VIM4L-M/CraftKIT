import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api",
  timeout: 10000
});

export async function getHealth() {
  const response = await api.get("/health");
  return response.data;
}