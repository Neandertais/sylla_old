import axios from "axios";

const BASE_URL = "http://localhost:3333/api/v1";

const token = localStorage.getItem("sylla.token");

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((request) => {
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});
