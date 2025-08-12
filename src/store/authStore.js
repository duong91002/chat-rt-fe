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
      console.log(data);
      set({ token: data.token, loading: false });
      Cookies.set("access_token", data.token, {
        expires: 1,
        // secure: true,
        sameSite: "strict",
      });
      return data.token;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Đăng nhập thất bại",
        loading: false,
      });
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
      return data.token;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Đăng ký thất bại",
        loading: false,
      });
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
