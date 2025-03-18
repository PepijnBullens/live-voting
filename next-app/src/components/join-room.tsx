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

  socket.on("joined-room", (room) => {
    if (room === null) _setRoom("");
    else setRoom(room);
  });

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (_room === "" || username === "") return;
    socket.emit("join-room", _room, username);
  };

  return (
    <form onSubmit={(e) => joinRoom(e)}>
      <input
        type="text"
        value={_room || ""}
        onChange={(e) => _setRoom(e.target.value)}
      />
      <input
        type="text"
        value={username || ""}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Join Room</button>
    </form>
  );
}
