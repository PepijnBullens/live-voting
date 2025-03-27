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

const getTotalVotes = (socket) => {
  const totalVotes = rooms[socket.room].options.reduce(
    (acc, option) => acc + option.votes.length,
    0
  );
  return totalVotes;
};

const returnOptionPercentage = (socket) => {
  const totalVotes = getTotalVotes(socket);

  const optionsWithPercentage = rooms[socket.room].options.map((option) => ({
    ...option,
    percentage: totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0,
  }));
  return optionsWithPercentage;
};

const votingComplete = async (socket) => {
  const totalVotes = getTotalVotes(socket);

  return (
    totalVotes === getMembers(await io.in(socket.room).fetchSockets()).length
  );
};

const getResult = async (socket) => {
  const percentages = await returnOptionPercentage(socket);
  const maxPercentage = Math.max(...percentages.map((p) => p.percentage));
  const winners = percentages.filter((p) => p.percentage === maxPercentage);

  // Shuffle the winners array
  for (let i = winners.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [winners[i], winners[j]] = [winners[j], winners[i]];
  }
  const winner = winners[Math.floor(Math.random() * winners.length)];
  return [winner, winners.length > 1];
};

const rooms = {};

io.on("connection", (socket) => {
  socket.emit(
    "list-rooms",
    Object.keys(rooms).map((room) => ({
      id: rooms[room]?.id,
      name: room,
      hasPassword: !!rooms[room]?.password,
    }))
  );

  socket.on("join-room", async (room, username, password) => {
    if (
      rooms[room] &&
      rooms[room].password &&
      rooms[room].password !== password
    ) {
      socket.emit("error", "Incorrect room password");
      return;
    }

    if (rooms[room] && rooms[room].started) {
      socket.emit("error", "Room is closed");
      return;
    }

    const isRoomNew = !rooms[room];

    socket.username = username;
    socket.room = room;
    socket.join(room);
    socket.emit("joined-room", room);

    if (isRoomNew) {
      rooms[room] = {
        id: nanoid(),
        options: [],
        question: null,
        admin: socket.id,
        started: false,
        password: password || null,
      };
    }

    const clients = await io.in(room).fetchSockets();
    const members = getMembers(clients);

    io.to(room).emit("list-members", members);
    socket.emit("list-members", members);
    io.to(room).emit("room-admin", rooms[room].admin);
    socket.emit("list-question", rooms[room].question);
    io.to(room).emit("list-question", rooms[room].question);
    socket.emit("list-password", rooms[room].password);

    io.emit(
      "list-rooms",
      Object.keys(rooms).map((room) => ({
        id: rooms[room].id,
        name: room,
        hasPassword: !!rooms[room].password,
      }))
    );

    console.log(`User ${socket.id}/${username} joined room ${room}`);
  });

  socket.on("option-remove", (id) => {
    if (
      rooms[socket.room] &&
      rooms[socket.room].started &&
      rooms[socket.room].started === true
    )
      return;

    rooms[socket.room].options = rooms[socket.room].options.filter(
      (_option) => _option.id !== id
    );

    io.to(socket.room).emit("list-options", returnOptionPercentage(socket));
  });

  socket.on("room-start", () => {
    if (socket.id !== rooms[socket.room].admin) return;

    rooms[socket.room].started = true;
    io.to(socket.room).emit("room-started");
    io.to(socket.room).emit("list-options", returnOptionPercentage(socket));
    socket.emit("list-options", returnOptionPercentage(socket));

    console.log(`Room: ${socket.room} has started`);
  });

  socket.on("options-update", (option) => {
    if (
      rooms[socket.room] &&
      rooms[socket.room].started &&
      rooms[socket.room].started === true
    )
      return;

    const newOption = { id: nanoid(), content: option, votes: [] };
    rooms[socket.room].options.push(newOption);
    io.to(socket.room).emit("list-options", returnOptionPercentage(socket));
    socket.emit("list-options", returnOptionPercentage(socket));
  });

  socket.on("question-update", (question) => {
    if (
      rooms[socket.room] &&
      rooms[socket.room].started &&
      rooms[socket.room].started === true
    )
      return;

    rooms[socket.room].question = question;
    io.to(socket.room).emit("list-question", question);
  });

  socket.on("leave-room", async () => {
    if (!socket.room) return;

    const room = socket.room;
    socket.leave(room);
    delete socket.room;

    const clients = await io.in(room).fetchSockets();
    if (clients.length === 0) {
      delete rooms[room];
    } else if (rooms[room].admin === socket.id) {
      clients.forEach((client) => {
        client.leave(room);
        client.emit("left-room");
        client.emit("admin-left");
      });
    }

    socket.emit("left-room");

    io.to(room).emit("list-members", getMembers(clients));
    io.emit(
      "list-rooms",
      Object.keys(rooms).map((room) => ({
        id: rooms[room].id,
        name: room,
        hasPassword: !!rooms[room].password,
      }))
    );

    console.log(`User ${socket.id} left room ${room}`);
  });

  socket.on("vote", async (id) => {
    const room = rooms[socket.room];
    if (!room) return;

    room.options.forEach((option) => {
      option.votes = option.votes.filter((vote) => vote.id !== socket.id);
    });

    const option = room.options.find((option) => option.id === id);
    if (option) {
      option.votes.push({ id: socket.id, option: true });
    }

    io.to(socket.room).emit("list-options", returnOptionPercentage(socket));

    const isComplete = await votingComplete(socket);

    if (isComplete) {
      io.to(socket.room).emit("can-end", isComplete);
    }
  });

  socket.on("voting-end", async () => {
    const canEnd = await votingComplete(socket);
    if (canEnd) {
      const [result, draw] = await getResult(socket);

      if (result) {
        io.to(socket.room).emit("can-end", canEnd);
        io.to(socket.room).emit("voting-ended", result, draw);
      }
    }
  });

  socket.on("disconnect", async () => {
    if (!socket.room) return;
    const room = socket.room;
    socket.leave(room);

    const clients = await io.in(room).fetchSockets();
    if (clients.length === 0) {
      delete rooms[room];
    } else if (rooms[room].admin === socket.id) {
      clients.forEach((client) => {
        client.leave(room);
        client.emit("left-room");
        client.emit("admin-left");
      });
    }

    io.to(room).emit("list-members", getMembers(clients));
    io.emit(
      "list-rooms",
      Object.keys(rooms).map((room) => ({
        id: rooms[room].id,
        name: room,
        hasPassword: !!rooms[room].password,
      }))
    );

    console.log(`User ${socket.id} disconnected from room ${room}`);
  });
});
