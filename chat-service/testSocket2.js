// testClient.js

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtb21lbmVsbWVzYWR5NDgwNTNAZ21haWwuY29tIiwiaWF0IjoxNzUxNDU4NjkxLCJleHAiOjE3NTE1NDUwOTF9.gIQo5EQyI4K5npkF7pR0HjAuy_P_EmybPmlgqU6DF74"
const { io } = require("socket.io-client");


const socket = io("http://localhost:3000", {
  auth: {
    token: token
  }
});

socket.emit('mark_chat_as_read', { chatId: 6 });


socket.on("connect", () => {
  console.log("Receiver connected", socket.id);
});


socket.on("friend_status_update",({userId,status})=>{
  console.log("User status, id:", userId,status);
})
socket.on("receive_message", (message) => {
  console.log("📨 New message received:", message);
});

socket.on("disconnect", () => {
  console.log("Receiver disconnected");
});
