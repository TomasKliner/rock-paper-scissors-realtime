"use client";

import { useEffect } from "react";
import QRCode from "react-qr-code";
import socket from "@/utils/socketio";
import { v4 as uuid } from "uuid";

export default function GamePage() {
  const userId = uuid();

  useEffect(() => {
    socket.on("game-created", (data) => {
      console.log("game-created-data", data);
    });

    // Connect to the server
    socket.connect();
    // Create a new game and set userID as host
    socket.emit("create-game", userId);

    return () => {
      socket.off("game-created");
    };
  }, []);

  const gameUrlforFriends = `${process.env.NEXT_PUBLIC_PROJECT_URL}/game/${userId}`;

  return (
    <div className="flex justify-center items-center flex-col gap-16 p-8 min-h-screen">
      <h1 className="text-4xl font-bold">Waiting for other player to join . . .</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-xl">Share the QR code or link below with your friend to join the game</h2>
        {/* <h2 className="text-xl font-bold">or simply share QR code</h2> */}
        <QRCode className="bg-white rounded-xl p-4 shadow" value={gameUrlforFriends} />
        <span className="font-bold text-sm rounded-xl bg-white text-black p-2 shadow">{gameUrlforFriends}</span>
      </div>
    </div>
  );
}
