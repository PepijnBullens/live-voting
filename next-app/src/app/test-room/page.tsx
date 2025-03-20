"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import TestRoom from "@/components/test-room";
import Room from "@/components/room";

export const socket = io("http://localhost:3010");

socket.on("connect", () => {
  console.log("You connected with id: " + socket.id);
});

socket.on("disconnect", () => {
  console.log("You disconnected");
});

export default function Websocket() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<string | null>(null);

  return isConnected ? (
    !room ? (
      <TestRoom socket={socket} setRoom={setRoom} />
    ) : (
      <Room socket={socket} room={room} setRoom={setRoom} />
    )
  ) : (
    <h2>Connecting...</h2>
  );
}
