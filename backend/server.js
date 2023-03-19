const express = require("express");
//const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { createProxyMiddleware } = require("http-proxy-middleware");
const { notFound,errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());  //to accept JSON data


app.get("/", (req, res) => {
    res.send("API is Running Successfully");
});

app.use("/api/user", userRoutes);

app.use('/api/chat', chatRoutes);

app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);
app.use(require("cors")());

const PORT = process .env.PORT || 5000
const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`.yellow.bold));

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
//const io = require('socket.io').listen(server);

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined Room: " + room);
    });
  
  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log('chat.users not defined');
    
    chat.users.forEach(users => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on('typing', (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});

