const express = require("express");
//const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
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

const PORT = process .env.PORT || 6000
const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`.yellow.bold));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  })
});