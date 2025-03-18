const io = require("socket.io")(3010, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const getMembers = (members) => {
  return members.map((member) => ({
    id: member.id,
    username: member.username,
  }));
};

io.on("connection", (socket) => {
  socket.on("join-room", async (room, username, password) => {
    const roomExists = await io.in(room).fetchSockets();
    if (roomExists.length > 0 && roomExists[0].password !== password) {
      socket.emit("error", "Incorrect room password");
      return;
    }

    socket.username = username;
    socket.room = room;
    socket.password = password;
    socket.join(room);
    socket.emit("joined-room", room);

    const members = getMembers(await io.in(room).fetchSockets());
    io.to(room).emit("list-members", members);

    console.log(`User: ${socket.id}/${username} joined room: ${room}`);
  });

  socket.on("leave-room", async (room) => {
    socket.leave(room);
    socket.emit("left-room");

    const members = getMembers(await io.in(room).fetchSockets());
    io.to(room).emit("list-members", members); // Update all clients

    console.log(`User: ${socket.id} left room: ${room}`);
  });

  socket.on("disconnect", async () => {
    if (socket.room) {
      const members = getMembers(await io.in(socket.room).fetchSockets());
      io.to(socket.room).emit("list-members", members);
      console.log(`User: ${socket.id} disconnected from room: ${socket.room}`);
    }
  });
});
