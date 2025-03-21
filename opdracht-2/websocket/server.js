const io = require("socket.io")(3010, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  socket.on("send-message", (message) => {
    io.emit("receive-message", message);
  });

  socket.on("ping", () => {
    socket.broadcast.emit("ping");
  });
});
