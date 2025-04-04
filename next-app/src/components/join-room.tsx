"use client";

import MainLayout from "@/layouts/main-layout";
import Aside from "@/components/aside/aside";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import SelectRoom from "@/components/aside/select-room";
import CreateRoom from "@/components/aside/create-room";
import { showToast } from "@/helpers/show-toast";

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
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [selectingRoom, setSelectingRoom] = useState(true);

  socket.on("joined-room", (room) => {
    if (room === null) _setRoom("");
    else setRoom(room);
  });

  socket.on("error", (message) => {
    if (message !== error) setError(message);
  });

  useEffect(() => {
    if (error === null) return;
    showToast("error", <p>{error}</p>);
    setError(null);
  }, [error]);

  const joinRoom = () => {
    if (_room === "" || _room === null || username === "" || username === null)
      return;
    socket.emit("join-room", _room, username, password);
  };

  const changeActiveRoom = (room: Room) => {
    if (activeRoom?.id === room.id) {
      _setRoom(null);
      setActiveRoom(null);
    } else {
      _setRoom(room.name);
      setActiveRoom(room);
    }
  };

  return (
    <MainLayout>
      <Aside>
        {selectingRoom ? (
          <SelectRoom
            rooms={rooms}
            changeActiveRoom={changeActiveRoom}
            activeRoom={activeRoom}
            setSelectingRoom={setSelectingRoom}
            joinRoom={joinRoom}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        ) : (
          <CreateRoom
            setSelectingRoom={setSelectingRoom}
            joinRoom={joinRoom}
            _setRoom={_setRoom}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        )}
      </Aside>
      <p className="order-1 w-full mt-8 md:mt-0 md:w-1/2 text-[#4D5061] text-xl z-100 mix-blend-difference [font-size:_clamp(1rem,1.6vw,1.6rem)]">
        <span className="uppercase font-bold">pollparty</span> is a live-vote
        discussion platform designed to make difficult decisions—like choosing
        which movie to watch with 10 people—super easy. Just create a room or
        join a friend's room and start voting!
      </p>
    </MainLayout>
  );
}
