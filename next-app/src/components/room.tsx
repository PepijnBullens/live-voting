"use client";

import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import Starting from "./room-states/starting";
import Started from "./room-states/started";
import Ended from "./room-states/ended";
import { showToast } from "@/helpers/show-toast";

interface Member {
  id: string;
  username: string;
}

interface Vote {
  id: string;
}

interface Option {
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

  const [password, setPassword] = useState<string | null>(null);

  const [started, setStarted] = useState(false);

  const [ended, setEnded] = useState(false);
  const [canEnd, setCanEnd] = useState(false);

  const [question, setQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<Option[]>([]);

  const [result, setResult] = useState<Option | null>(null);
  const [draw, setDraw] = useState(false);

  const [newOption, setNewOption] = useState("");

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

  const createNewOption = () => {
    if (newOption === "") {
      showToast("error", <p>Type in an option.</p>);
      return;
    }
    socket.emit("options-update", newOption);
    setNewOption("");
  };

  const removeOption = (id: string) => {
    socket.emit("option-remove", id);
  };

  const vote = (id: string) => {
    socket.emit("vote", id);
  };

  const endVoting = () => {
    socket.emit("voting-end");
  };

  // ----------------- WEBSOCKET FROM

  useEffect(() => {
    socket.on("list-password", (_password) => {
      setPassword(_password);
    });

    socket.on("left-room", () => {
      setRoom("");
    });

    socket.on("list-members", (members) => {
      setMembers(members);
    });

    socket.on("room-admin", (adminId) => {
      setAdmin(adminId === socket.id);
    });

    socket.on("list-question", (question) => {
      setQuestion(question);
    });

    socket.on("list-options", (_options) => {
      setOptions(_options);
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
      setResult(_result);
      setDraw(_draw);
    });

    socket.on("can-end", (_canEnd) => {
      setCanEnd(_canEnd);
    });

    return () => {
      socket.off("list-password");
      socket.off("left-room");
      socket.off("list-members");
      socket.off("room-admin");
      socket.off("list-question");
      socket.off("list-options");
      socket.off("admin-left");
      socket.off("room-started");
      socket.off("voting-ended");
      socket.off("can-end");
    };
  }, [
    socket,
    setPassword,
    setRoom,
    setMembers,
    setAdmin,
    setQuestion,
    setOptions,
    setStarted,
    setEnded,
    setResult,
    setDraw,
    setCanEnd,
  ]);

  return (
    <>
      {/* <div>
        <h1>Room: {room}</h1>
        <button onClick={leaveRoom}>Leave Room</button>

        <ul>
          {members &&
            members.map((member) => <li key={member.id}>{member.username}</li>)}
        </ul>
      </div> */}
      <div>
        {started && (
          <Started
            options={options}
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
            options={options}
            removeOption={removeOption}
            newOption={newOption}
            setNewOption={setNewOption}
            createNewOption={createNewOption}
            startRoom={startRoom}
            admin={admin}
            leaveRoom={leaveRoom}
            password={password}
          />
        )}
        {!started && ended && <Ended result={result} draw={draw} />}
      </div>
    </>
  );
}
