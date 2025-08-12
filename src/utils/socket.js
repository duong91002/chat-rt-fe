import { io } from "socket.io-client";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_BE_SOCKET_URL;
let socket = null;

export const connectSocket = () => {
  const token = Cookies.get("access_token");

  if (!token || socket) return socket;

  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) socket = connectSocket();
  return socket;
};
