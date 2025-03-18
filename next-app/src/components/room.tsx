"use client";

import { useState } from "react";
import { Socket } from "socket.io-client";
import { Delete } from "lucide-react";

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

  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [newAnswer, setNewAnswer] = useState("");

  const leaveRoom = () => {
    socket.emit("leave-room", room);
  };

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

  const updateQuestion = (question: string) => {
    socket.emit("question-update", question);
  };

  const createNewAnswer = () => {
    if (newAnswer === "") return;
    socket.emit("anwsers-update", newAnswer);
    setNewAnswer("");
  };

  const removeAnswer = (id: string) => {
    socket.emit("answer-remove", id);
  };

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
        {admin ? (
          <>
            <input
              type="text"
              name="question"
              id="question"
              value={question || ""}
              placeholder="question"
              onChange={(e) => updateQuestion(e.target.value)}
            />
            <div>
              {answers?.map((answer) => (
                <div key={answer.id}>
                  {answer.content}
                  {answer.votes}
                  <Delete onClick={() => removeAnswer(answer.id)} />
                </div>
              ))}
            </div>
            <input
              type="text"
              name="newAnswer"
              id="newAnswer"
              value={newAnswer || ""}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button onClick={createNewAnswer}>New Answer</button>
          </>
        ) : (
          <>
            <div>
              {answers?.map((answer) => (
                <div key={answer.id}>
                  {answer.content}
                  {answer.votes}
                </div>
              ))}
            </div>
            <p>{question}</p>
          </>
        )}
      </div>
    </>
  );
}
