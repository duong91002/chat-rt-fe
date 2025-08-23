import { create } from "zustand";
import { loadingStore } from "../utils/loadingStore";
import { getListRoomsApi } from "../services/roomService";
import { getListChatInRoomsApi } from "../services/messageService";

const useRoomStore = create((set) => ({
  rooms: [],
  room: null,
  currentPageMessages: 1,
  totalPagesMessages: 1,
  loading: {
    rooms: false,
    messages: false,
  },
  setPaginationDefaults: () =>
    set({ currentPageMessages: 1, totalPagesMessages: 1 }),
  addMessageInRoom: (message) => {
    set((state) => ({
      room: { ...state.room, messages: [...state.room.messages, message] },
    }));
  },
  fetchMessagesInRoom: async (filters = {}) => {
    try {
      const response = await loadingStore(
        () => getListChatInRoomsApi(filters),
        set,
        "messages"
      );
      set((state) => ({
        room: {
          ...state.room,
          messages: [...response.data, ...state.room.messages],
        },
        currentPageMessages: response.currentPage,
        totalPagesMessages: response.totalPages,
      }));
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },
  addRooms: (rooms) => set((state) => ({ rooms: [...state.rooms, ...rooms] })),
  fetchRooms: async (filter = {}) => {
    try {
      const data = await loadingStore(
        () => getListRoomsApi(filter),
        set,
        "rooms"
      );
      set((state) => ({
        rooms: [...state.rooms, ...data],
      }));
      return data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  },
  clearRooms: () => set({ rooms: [] }),
  setRoom: (room) => set({ room }),
  addRoom: (room, lastMessage) =>
    set((state) => ({
      rooms: [
        { ...room, lastMessage },
        ...state.rooms.filter((r) => r._id !== room._id),
      ],
    })),
  setLastMessageInRooms: (roomData, message) => {
    set((state) => {
      let updatedRooms = [];
      const findRoom = state.rooms.find((r) => r._id === roomData._id);
      if (findRoom) {
        updatedRooms = state.rooms.map((room) =>
          room._id === message.roomId
            ? { ...room, lastMessage: parseLastMessage(message) }
            : room
        );
      } else {
        const newRoom = {
          ...roomData,
          lastMessage: parseLastMessage(message),
        };
        updatedRooms = [...state.rooms, newRoom];
      }

      return {
        rooms: updatedRooms.sort(
          (a, b) =>
            new Date(b.lastMessage?.updatedAt || 0) -
            new Date(a.lastMessage?.updatedAt || 0)
        ),
      };
    });
  },

  sortRooms: (roomId, lastMessage) => {
    lastMessage = parseLastMessage(lastMessage);
    set((state) => {
      const isRoomExist = state.rooms.some((r) => r._id === roomId);
      let updatedRooms;
      if (isRoomExist) {
        updatedRooms = state.rooms.map((room) =>
          room._id === roomId ? { ...room, lastMessage } : room
        );
      } else {
        updatedRooms = [...state.rooms, { _id: roomId, lastMessage }];
      }
      return {
        rooms: updatedRooms.sort(
          (a, b) =>
            new Date(b.lastMessage?.updatedAt || 0) -
            new Date(a.lastMessage?.updatedAt || 0)
        ),
      };
    });
  },
}));

const parseLastMessage = (message) => ({
  senderId: { _id: message.senderId },
  message: message.message,
  typeChat: message.typeChat,
  updatedAt: Date.now(),
});

export { useRoomStore };
