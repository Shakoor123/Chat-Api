const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
require("dotenv").config();
// Import routes
const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversation");

const cors = require("cors");
app.use(cors());

app.use(express.json());

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

// Handle HTTP requests
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Handle WebSocket connections
// array to store online users
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  // add user to online users array
  socket.on("user-connected", (userId) => {
    onlineUsers.push({ socketId: socket.id, userId });
    io.emit("online-users", onlineUsers);
  });

  // remove user from online users array
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("online-users", onlineUsers);
  });

  // handle chat messages
  socket.on("chat-message", (data) => {
    const { senderId, receiverId, message } = data;
    const receiver = onlineUsers.find((user) => user.userId === receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("chat-message", { senderId, message });
    }
  });
});

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err.message);
  });

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
