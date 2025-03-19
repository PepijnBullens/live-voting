"use client";

import { useState } from "react";
import { Socket } from "socket.io-client";
import AdminStarting from "./room-states/admin-starting";
import Started from "./room-states/started";

interface Member {
  id: string;
  username: string;
}

interface Answer {
  id: string;
  content: string;
  votes: number;
}

export default function Room({
  socket,
  room,
  setRoom,
}: {
  socket: Socket;
  room: string | null;
  setRoom: (room: string | null) => void;
}) {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [admin, setAdmin] = useState(false);
  const [started, setStarted] = useState(false);

  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [newAnswer, setNewAnswer] = useState("");

  // ----------------- WEBSOCKET TO

  const leaveRoom = () => {
    socket.emit("leave-room");
  };

  const startRoom = () => {
    socket.emit("room-start");
  };

  const updateQuestion = (question: string) => {
    socket.emit("question-update", question);
  };

  const createNewAnswer = () => {
    if (newAnswer === "") return;
    socket.emit("answers-update", newAnswer);
    setNewAnswer("");
  };

  const removeAnswer = (id: string) => {
    socket.emit("answer-remove", id);
  };

  // ----------------- WEBSOCKET FROM

  socket.on("left-room", () => {
    setRoom("");
  });

  socket.on("list-members", (members) => {
    setMembers(members);
  });

  socket.on("room-admin", () => {
    setAdmin(true);
  });

  socket.on("list-question", (question) => {
    setQuestion(question);
  });

  socket.on("list-answers", (answers) => {
    setAnswers(answers);
  });

  socket.on("admin-left", () => {
    setRoom("");
  });

  socket.on("room-started", () => {
    setStarted(true);
  });

  return (
    <>
      <div>
        <h1>Room: {room}</h1>
        <button onClick={leaveRoom}>Leave Room</button>

        <ul>
          {members &&
            members.map((member) => <li key={member.id}>{member.username}</li>)}
        </ul>
      </div>
      <div>
        {started ? (
          <Started answers={answers} question={question} />
        ) : admin ? (
          <AdminStarting
            question={question}
            updateQuestion={updateQuestion}
            answers={answers}
            removeAnswer={removeAnswer}
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            createNewAnswer={createNewAnswer}
            startRoom={startRoom}
          />
        ) : (
          <>
            <div>Room is being set up. Wait for the admin to start.</div>
            <p>{question}</p>
          </>
        )}
      </div>
    </>
  );
}
