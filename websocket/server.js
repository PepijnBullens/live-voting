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
  socket.on("join-room", async (room, username, password) => {
    const roomExists = await io.in(room).fetchSockets();

    // Password check
    if (roomExists.length > 0 && roomExists[0].password !== password) {
      socket.emit("error", "Incorrect room password");
      return;
    }

    // Check if room is already started
    if (rooms[room] && rooms[room].started) {
      socket.emit("error", "Room is closed");
      return;
    }

    const isRoomAdmin = roomExists.length === 0;

    socket.username = username;
    socket.password = password;
    socket.room = room;
    socket.join(room);
    socket.emit("joined-room", room);

    const clients = await io.in(room).fetchSockets();
    const members = getMembers(clients);
    io.to(room).emit("list-members", members);

    if (isRoomAdmin) {
      rooms[room] = {
        answers: [],
        question: null,
        admin: socket.id,
        started: false,
        password: password,
      };

      socket.emit("room-admin");
    } else {
      io.to(rooms[room].admin).emit("room-admin");
    }

    socket.emit("list-answers", rooms[room].answers || []);
    socket.emit("list-question", rooms[room].question || []);

    console.log(`User: ${socket.id}/${username} joined room: ${room}`);
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

    console.log(rooms[socket.room].started);

    rooms[socket.room].question = question;
    io.to(socket.room).emit("list-question", question);
  });

  socket.on("leave-room", async () => {
    if (!socket.room) return;

    console.log(`User: ${socket.id} leaving room: ${socket.room}`);

    socket.leave(socket.room);

    const clients = await io.in(socket.room).fetchSockets();
    const members = getMembers(clients);

    io.to(socket.room).emit("list-members", members);

    if (rooms[socket.room]?.admin === socket.id) {
      io.to(socket.room).emit("admin-left");

      const sockets = await io.in(socket.room).fetchSockets();
      sockets.forEach((s) => s.leave(socket.room));
      delete rooms[socket.room];
    }

    socket.emit("left-room");

    delete socket.room;
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
    if (socket.room) {
      socket.leave(socket.room);

      const clients = await io.in(socket.room).fetchSockets();

      if (clients) {
        const members = getMembers(clients);
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

        console.log(
          `User: ${socket.id} disconnected from room: ${socket.room}`
        );
      }
    }
  });
});
