import { Server } from "socket.io";

const io = new Server(3002, {
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

  // Letter is played from player, opponent is receiving
  socket.on("Letter Played", (tile)=>{
    socket.broadcast.emit("Letter Played", tile);
  });

  // Letter is removed from player, opponent is receiving
  socket.on("Letter Removed", ({position})=>{
    socket.broadcast.emit("Letter Removed", {position});
  });

  socket.on("Fill Tiles", (letters)=>{
    socket.broadcast.emit("Fill Tiles", letters);
  })

  socket.on("Game Start", (tiles)=>{
    socket.broadcast.emit("Game Start", tiles);
  });
  socket.on("Switch Turn", (totalMoney)=>{
    socket.broadcast.emit("Switch Turn", totalMoney);
  })
});