import { create } from "zustand";
import { loadingStore } from "../utils/loadingStore";
import { getListChatInRoomsApi } from "../services/messageService";

const useMessageStore = create((set) => ({
  messages: [],
  error: null,
  loading: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  fetchMessages: async (filters = {}) => {
    try {
      const data = await loadingStore(
        () => getListChatInRoomsApi(filters),
        set
      );
      set((state) => ({
        messages: [...data, ...state.messages],
      }));
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },
  clearMessages: async () => set({ messages: [] }),
}));

export default useMessageStore;
