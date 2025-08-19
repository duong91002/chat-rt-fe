import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: undefined,
  onCancel: undefined,
  open: ({ title, message, onConfirm, onCancel }) => {
    set({ isOpen: true, title, message, onConfirm, onCancel });
  },
  close: () => set({ isOpen: false }),
}));
export default useModalStore;
