const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE = IS_LOCAL 
  ? "http://localhost:5000" 
  : "https://session-booking-system-145h.onrender.com";