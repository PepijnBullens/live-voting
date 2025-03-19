"use client";

import MainLayout from "@/layouts/main-layout";
import Aside from "@/components/aside";
import { useState } from "react";
import type { Socket } from "socket.io-client";

interface Room {
  id: string;
  name: string;
  hasPassword: boolean;
}

export default function JoinRoom({
  socket,
  setRoom,
  rooms,
}: {
  socket: Socket;
  setRoom: (room: string) => void;
  rooms: Room[];
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
    <MainLayout>
      <Aside>
        <div>
          <h2 className="uppercase font-semibold border-b-1 text-[#E5ECF4] pb-1 mb-1">
            join a room
          </h2>
          {rooms.map((room) => (
            <div
              className="w-full h-8 flex gap-2 items-center py-1"
              key={room.id}
            >
              <div
                className={`h-4 aspect-square rounded-full  ${
                  room.hasPassword ? "bg-[#F25757]" : "bg-[#69DC9E]"
                }`}
              ></div>
              <h3 className="uppercase font-semibold text-[#E5ECF4] overflow-ellipsis overflow-hidden">
                {room.name}
              </h3>
            </div>
          ))}
        </div>
      </Aside>
      <p className="w-1/2 text-[#4D5061] text-xl z-100 mix-blend-difference [font-size:_clamp(1rem,1.6vw,1.6rem)]">
        <span className="uppercase font-bold">pollparty</span> is a live-vote
        discussion platform designed to make difficult decisions—like choosing
        which movie to watch with 10 people—super easy. Just create a room or
        join a friend's room and start voting!
      </p>
    </MainLayout>
  );
}
