import axios from "axios";

const BASE_URL = "http://localhost:3333/api/v1";

const token = localStorage.getItem("sylla.token");

export const fetch = axios.create({
  baseURL: BASE_URL,
});

export const api = (url: string) => fetch.get(url).then((res) => res.data);

fetch.interceptors.request.use((request) => {
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});
