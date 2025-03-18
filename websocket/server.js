const { nanoid } = require("nanoid");

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

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", async (room, username, password) => {
    const roomExists = await io.in(room).fetchSockets();
    if (roomExists.length > 0 && roomExists[0].password !== password) {
      socket.emit("error", "Incorrect room password");
      return;
    }

    const isRoomAdmin = roomExists.length === 0;

    socket.username = username;
    socket.room = room;
    socket.password = password;
    socket.join(room);
    socket.emit("joined-room", room);

    if (isRoomAdmin) {
      socket.emit("room-admin");
      rooms[room] = { answers: [], question: null, admin: socket.id };
    }

    const members = getMembers(await io.in(room).fetchSockets());
    io.to(room).emit("list-members", members);

    socket.emit("list-answers", rooms[room].answers || []);
    socket.emit("list-question", rooms[room].question || []);

    console.log(`User: ${socket.id}/${username} joined room: ${room}`);
  });

  socket.on("answer-remove", (id) => {
    rooms[socket.room].answers = rooms[socket.room].answers.filter(
      (_answer) => _answer.id !== id
    );
    io.to(socket.room).emit("list-answers", rooms[socket.room].answers);
  });

  socket.on("anwsers-update", (answer) => {
    const newAnswer = { id: nanoid(), content: answer, votes: 0 };
    rooms[socket.room].answers.push(newAnswer);
    io.to(socket.room).emit("list-answers", rooms[socket.room].answers);
  });

  socket.on("question-update", (question) => {
    rooms[socket.room].question = question;
    io.to(socket.room).emit("list-question", question);
  });

  socket.on("leave-room", async (room) => {
    io.to(room).emit("left-room");
    socket.leave(room);

    const members = getMembers(await io.in(room).fetchSockets());
    io.to(room).emit("list-members", members);

    if (rooms[room] && rooms[room].admin && socket.id == rooms[room].admin) {
      io.to(room).emit("admin-left");
      const sockets = await io.in(room).fetchSockets();
      sockets.forEach((socket) => socket.leave(room));
      delete rooms[room];
    }

    console.log(`User: ${socket.id} left room: ${room}`);
  });

  socket.on("disconnect", async () => {
    if (socket.room) {
      socket.leave(socket.room);

      const members = getMembers(await io.in(socket.room).fetchSockets());
      io.to(socket.room).emit("list-members", members);

      if (
        rooms[socket.room] &&
        rooms[socket.room].admin &&
        socket.id == rooms[socket.room].admin
      ) {
        io.to(socket.room).emit("admin-left");
        const sockets = await io.in(socket.room).fetchSockets();
        sockets.forEach((socket) => socket.leave(socket.room));
        delete rooms[socket.room];
      }

      console.log(`User: ${socket.id} disconnected from room: ${socket.room}`);
    }
  });
});
