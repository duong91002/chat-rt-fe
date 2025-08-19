import { create } from "zustand";
import {
  loginApi,
  registerApi,
  getInformationApi,
} from "../services/authService";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await loginApi(body);
      set({ token: data.token, loading: false });
      Cookies.set("access_token", data.token, {
        expires: 1,
        sameSite: "strict",
      });
      return { token: data.token };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      set({ error: errorMsg, loading: false });
      return { error: errorMsg };
    }
  },

  register: async (body) => {
    set({ loading: true, error: null });
    try {
      const { data } = await registerApi(body);
      set({ token: data.token, loading: false });
      Cookies.set("access_token", data.token, {
        expires: 1,
        // secure: true,
        sameSite: "strict",
      });
      return { token: data.token };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      set({ error: errorMsg, loading: false });
      return { error: errorMsg };
    }
  },

  getInformation: async () => {
    try {
      const token = Cookies.get("access_token");
      if (token) {
        const { data } = await getInformationApi(token);
        set({ user: data, loading: false });
        return data;
      }
      Cookies.remove("access_token");
    } catch (err) {
      Cookies.remove("access_token");
    }
  },

  logout: () => {
    Cookies.remove("access_token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
