"use client";

import { useState } from "react";
import type { Socket } from "socket.io-client";

export default function JoinRoom({
  socket,
  setRoom,
}: {
  socket: Socket;
  setRoom: (room: string) => void;
}) {
  const [_room, _setRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  socket.on("joined-room", (room) => {
    if (room === null) _setRoom("");
    else setRoom(room);
  });

  socket.on("error", (message) => {
    setError(message);
  });

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (_room === "" || username === "" || password === "") return;
    socket.emit("join-room", _room, username, password);
  };

  return (
    <form onSubmit={(e) => joinRoom(e)}>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={_room || ""}
        placeholder="room"
        onChange={(e) => _setRoom(e.target.value)}
      />
      <input
        type="password"
        value={password || ""}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        value={username || ""}
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Join Room</button>
    </form>
  );
}
