// receiver.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  query: { userId: 3 },
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("[Receiver] Connected");
  socket.emit("register_user", { userId: 3 });
});

socket.on("receive_message", (msg) => {
  console.log("[Receiver] Message received:", msg);
});

socket.on("status_update", (data) => {
  console.log("[Receiver] Status update:", data);
});

socket.on("error_occurred", (err) => {
  console.error("[Receiver] Error:", err);
});
