const { io } = require("socket.io-client");

// Connect to your Socket.IO server (no auth needed)
const socket = io("http://localhost:3000");

// When connected
socket.on("connect", () => {
  console.log("✅ Connected to server with socket ID:", socket.id);

  // Emit a test event to the server
  socket.emit("ping_test", { msg: "Hello from client!" });
});

// Listen for server's response
socket.on("pong_test", (data) => {
  console.log("✅ Received from server:", data);
});

// Handle connection error
socket.on("connect_error", (err) => {
  console.error("❌ Connect error:", err.message);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
