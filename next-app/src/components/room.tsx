"use client";

import { useState } from "react";
import { Socket } from "socket.io-client";
import Starting from "./room-states/starting";
import Started from "./room-states/started";
import Ended from "./room-states/ended";

interface Member {
  id: string;
  username: string;
}

interface Vote {
  id: string;
}

interface Answer {
  id: string;
  content: string;
  percentage: number;
  votes: Vote[];
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

  const [ended, setEnded] = useState(false);
  const [canEnd, setCanEnd] = useState(false);

  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [result, setResult] = useState<Answer | null>(null);
  const [draw, setDraw] = useState(false);

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

  const vote = (id: string) => {
    socket.emit("vote", id);
  };

  const endVoting = () => {
    socket.emit("voting-end");
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

  socket.on("voting-ended", (_result, _draw) => {
    setEnded(true);
    setStarted(false);
    console.log(_result);

    setResult(_result);
    setDraw(_draw);
  });

  socket.on("can-end", (_canEnd) => {
    setCanEnd(_canEnd);
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
        {started && (
          <Started
            answers={answers}
            question={question}
            vote={vote}
            endVoting={endVoting}
            admin={admin}
            canEnd={canEnd}
          />
        )}
        {!started && !ended && (
          <Starting
            question={question}
            updateQuestion={updateQuestion}
            answers={answers}
            removeAnswer={removeAnswer}
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            createNewAnswer={createNewAnswer}
            startRoom={startRoom}
            admin={admin}
          />
        )}
        {!started && ended && <Ended result={result} draw={draw} />}
      </div>
    </>
  );
}
