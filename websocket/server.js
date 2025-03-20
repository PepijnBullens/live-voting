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
  const totalVotes = rooms[socket.room].answers.reduce(
    (acc, answer) => acc + answer.votes.length,
    0
  );
  return totalVotes;
};

const returnAnswerPercentage = (socket) => {
  const totalVotes = getTotalVotes(socket);

  const answersWithPercentage = rooms[socket.room].answers.map((answer) => ({
    ...answer,
    percentage: totalVotes > 0 ? (answer.votes.length / totalVotes) * 100 : 0,
  }));
  return answersWithPercentage;
};

const votingComplete = async (socket) => {
  const totalVotes = getTotalVotes(socket);

  return (
    totalVotes === getMembers(await io.in(socket.room).fetchSockets()).length
  );
};

const getResult = async (socket) => {
  const percentages = await returnAnswerPercentage(socket);
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
        answers: [],
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

  socket.on("answer-remove", (id) => {
    if (
      rooms[socket.room] &&
      rooms[socket.room].started &&
      rooms[socket.room].started === true
    )
      return;

    rooms[socket.room].answers = rooms[socket.room].answers.filter(
      (_answer) => _answer.id !== id
    );

    io.to(socket.room).emit("list-answers", returnAnswerPercentage(socket));
  });

  socket.on("room-start", () => {
    if (socket.id !== rooms[socket.room].admin) return;

    rooms[socket.room].started = true;
    io.to(socket.room).emit("room-started");

    console.log(`Room: ${socket.room} has started`);
  });

  socket.on("answers-update", (answer) => {
    if (
      rooms[socket.room] &&
      rooms[socket.room].started &&
      rooms[socket.room].started === true
    )
      return;

    const newAnswer = { id: nanoid(), content: answer, votes: [] };
    rooms[socket.room].answers.push(newAnswer);
    io.to(socket.room).emit("list-answers", returnAnswerPercentage(socket));
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
      rooms[room].admin = clients[0].id;
      io.to(room).emit("room-admin", rooms[room].admin);
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

    room.answers.forEach((answer) => {
      answer.votes = answer.votes.filter((vote) => vote.id !== socket.id);
    });

    const answer = room.answers.find((answer) => answer.id === id);
    if (answer) {
      answer.votes.push({ id: socket.id, answer: true });
    }

    io.to(socket.room).emit("list-answers", returnAnswerPercentage(socket));

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
      delete rooms[room]; // Clear room if empty
    } else if (rooms[room].admin === socket.id) {
      rooms[room].admin = clients[0].id; // Assign a new admin
      io.to(room).emit("room-admin", rooms[room].admin);
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
