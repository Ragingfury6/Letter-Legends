import { Server } from "socket.io";

const io = new Server(3000, {
  cors:{
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  // send a message to the client
  socket.emit("hello from server");

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    console.log("got hello from client");
  });
});