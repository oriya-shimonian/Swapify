// 📁 src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: number) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
      socket?.emit("register", userId);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
