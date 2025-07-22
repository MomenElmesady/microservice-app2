// testClient.js


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtb21lbmVsbWVzYWR5NDgwNTNAZ21haWwuY29tIiwiaWF0IjoxNzUzMjE2MTEyLCJleHAiOjE3NTMzMDI1MTJ9.T7apyHWCRHkqNauytnwkRi18PHc8K30THm1JN_sTeQk"
const { io } = require("socket.io-client");

const socket = io("http://localhost", {
  auth: {
    token: token,
  },
  path: '/chat/socket.io',
  transports: ['websocket']
});

socket.on("connect", () => {
  console.log("Sender connected", socket.id);
  setTimeout(() => {
    console.log("After 2 seconds");
    sendMessage(socket, 1, {
      chatId: 6,
      content: "Hello from sender2222",
      type: "text",
      media_url: null
    });
}, 2000); // 2000ms = 2s
  // Send message to receiver
  
});
socket.on("success", (data) => {
  console.log("✅ Received from server:", data);
});
socket.on("message_sent_ack", ({ messageId }) => {
  console.log("Message sent, id:", messageId);
});
socket.on("friend_status_update",({userId,status})=>{
  console.log("User status, id:", userId,status);
})
socket.on("messageDelivered", ({ messageId,receiverId }) => {
  console.log("Message deliverd, id:", messageId,receiverId);
});
socket.on("message_read", ({ messageId,readerId }) => {
  console.log("Message readed, id:", messageId);
});

socket.on("disconnect", () => {
  console.log("Sender disconnected");
});

function sendMessage(socket, receiverId, message) {
  socket.emit("send_message", {
    receiverId,
    message
  });
  console.log("📤 Message sent:", message.content);
}
