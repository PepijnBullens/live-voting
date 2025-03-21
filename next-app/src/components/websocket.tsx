"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import JoinRoom from "@/components/join-room";
import Room from "@/components/room";
import { showToast } from "@/helpers/show-toast";

export const socket = io("http://localhost:3010");

export default function Websocket() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      showToast("success", <p>Connected successfully!</p>);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setRoom(null);
      showToast("warning", <p>Disconnected...</p>);
    });

    socket.on("list-rooms", (_rooms) => {
      setRooms(_rooms);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("list-rooms");
    };
  }, []);

  return isConnected ? (
    !room ? (
      <JoinRoom socket={socket} setRoom={setRoom} rooms={rooms} />
    ) : (
      <Room socket={socket} room={room} setRoom={setRoom} />
    )
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <span className="loader"></span>
    </div>
  );
}
