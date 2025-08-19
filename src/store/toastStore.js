import { create } from "zustand";

const useToastStore = create((set) => ({
  open: false,
  message: "",
  severity: "success",

  showToast: (message, severity = "success") => {
    set({ open: true, message, severity });
  },

  close: () => {
    set({ open: false, message: "", severity: "success" });
  },
}));

export default useToastStore;
