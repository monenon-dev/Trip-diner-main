import { API_BASE } from "../config/api";
import axios from "axios";


export const http = axios.create({
  baseURL: API_BASE,
});

// 요청마다 토큰 자동 첨부
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
