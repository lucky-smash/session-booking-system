import { io } from "socket.io-client";

const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const SOCKET_URL = IS_LOCAL 
  ? "http://localhost:5000" 
  : "https://session-booking-system-145h.onrender.com";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});