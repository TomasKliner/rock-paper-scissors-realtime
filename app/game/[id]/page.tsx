'use client';

import socket from "@/utils/socketio";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

type Params = {
  id: string;
};

type Move = "rock" | "paper" | "scissors" | null;

export default function Page({ params }: { params: Params }) {
  const { id } = params;
  const userId = uuid();
  

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-game", userId);
    })

    socket.on("game-joined", (data) => {
      console.log("game-joined-data", data);
    });

    // Connect to the server
    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("game-joined");
    };
  }, []);

  return (
    <div>
      <h1>Game ID: {id}</h1>
      <h2>User ID: {userId}</h2>
    </div>
  );

}
