import axios from "axios";

import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BE_URL;
export const axiosHelperPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosHelperPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosHelperPrivate.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Cookies.remove("access_token");
    return Promise.reject(error);
  }
);
