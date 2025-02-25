"use client";
import socket from "@/utils/socketio";
import { useEffect, useState } from "react";
export default function Game({gameId,  userId}) {

  const [gameState, setGameState] = useState(null);


  useEffect(() => {
    socket.on("game-state",
      (data) => {
        console.log("game-state", data);
        setGameState(data);
      }
    );
    // Connect to the server
    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("game-state");
    };
  });

  function handleMove(move: "rock" | "paper" | "scissors") {
    socket.emit("make-move", {gameId, userId, move});
  }

  return (
    <div className="flex justify-evenly items-center gap-4 h-[50vh]">
      <button
        onClick={() => handleMove("rock")}
        className="bg-white rounded-full shadow text-black font-bold w-64 h-64 border-[2rem] border-green-500">
        Rock
      </button>
      <button
        onClick={() => handleMove("paper")}
        className="bg-white rounded-full shadow text-black font-bold  w-64 h-64 border-[2rem] border-orange-500">
        Paper
      </button>
      <button
        onClick={() => handleMove("scissors")}
        className="bg-white rounded-full shadow text-black font-bold  w-64 h-64 border-[2rem] border-red-500">
        Scissors
      </button>
    </div>
  );
}
