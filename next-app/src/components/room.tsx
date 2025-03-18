"use client";

import { useState } from "react";
import { Socket } from "socket.io-client";

interface Member {
  id: string;
  username: string;
}

export default function Room({
  socket,
  room,
  setRoom,
}: {
  socket: Socket;
  room: string;
  setRoom: (room: string) => void;
}) {
  const [members, setMembers] = useState<Member[] | null>(null);

  const leaveRoom = () => {
    socket.emit("leave-room", room);
  };

  socket.on("left-room", () => {
    setRoom("");
  });

  socket.on("list-members", (members) => {
    setMembers(members);
  });

  return (
    <div>
      <h1>Room: {room}</h1>
      <button onClick={leaveRoom}>Leave Room</button>

      <ul>
        {members &&
          members.map((member) => <li key={member.id}>{member.username}</li>)}
      </ul>
    </div>
  );
}
