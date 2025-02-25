'use client';

import Game from "@/components/Game";
import socket from "@/utils/socketio";
import { use, useEffect } from "react";
import { v4 as uuid } from 'uuid';

type Params = {
  id: string;
};

type Move = "rock" | "paper" | "scissors" | null;

export default function Page({ params }: { params: Promise<Params> }) {
  const { id: gameId } = use(params);
  const userId = uuid();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-game", {gameId, userId});
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
    <div className="w-full h-full">
      <h1 className="text-5xl font-bold text-center w-full">Rock paper scissors</h1>
      <Game gameId={gameId} userId={userId} />
    </div>
  );

}
