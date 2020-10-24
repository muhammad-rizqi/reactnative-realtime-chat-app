const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("chat messages", (data) => {
    io.emit("chat messages", {
      username: socket.username,
      message: data.message,
    });
  });

  socket.username = "Anonymous";

  socket.on("change_username", (data) => {
    socket.username = data;
    console.log("username changed to: " + socket.username);
  });
});

server.listen(port, () => console.log("running on : " + port));
