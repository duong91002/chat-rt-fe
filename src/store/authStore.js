import { create } from "zustand";
import {
  loginApi,
  registerApi,
  getInformationApi,
} from "../services/authService";
import Cookies from "js-cookie";
import { loadingStore } from "../utils/loadingStore";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (body) => {
    try {
      const data = await loadingStore(() => loginApi(body), set);
      Cookies.set("access_token", data.token, {
        expires: 1,
        sameSite: "strict",
      });
      set({ token: data.token });
      return { token: data.token, error: null };
    } catch (err) {
      return {
        token: null,
        user: null,
        error: err.response?.data?.error || "Login failed",
      };
    }
  },

  register: async (body) => {
    try {
      const data = await loadingStore(() => registerApi(body), set);
      Cookies.set("access_token", data.token, {
        expires: 1,
        sameSite: "strict",
      });
      set({ token: data.token });
      return { token: data.token, error: null };
    } catch (err) {
      return {
        token: null,
        user: null,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  },

  getInformation: async () => {
    try {
      const data = await loadingStore(() => getInformationApi(), set);
      set({ user: data });
      return { user: data };
    } catch (err) {
      Cookies.remove("access_token");
      return {
        token: null,
        user: null,
        error: err.response?.data?.error || "Failed to fetch user information",
      };
    }
  },

  logout: () => {
    Cookies.remove("access_token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
