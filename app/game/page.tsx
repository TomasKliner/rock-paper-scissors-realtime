"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import socket from "@/utils/socketio";
import { v4 as uuid } from "uuid";
import Game from "@/components/Game";

export default function GamePage() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [userId] = useState(uuid());

  useEffect(() => {
    socket.on("game-created", (data) => {
      console.log("game-created-data", data);
    });
    socket.on("game-started", (data) => {
      console.log("game-started-data", data);
      setGameStarted(true);
    });

    // Connect to the server
    socket.connect();
    // Create a new game and set userID as host
    socket.emit("create-game", userId);

    return () => {
      socket.off("game-created");
      socket.off("game-started");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setInviteUrl(`${window.location.href}/${userId}`);
  }, [userId]);

  return (
    <div className="flex justify-center items-center flex-col gap-16 p-8 min-h-screen">
      {!gameStarted ? (
        <>
          <h1 className="text-4xl font-bold">Waiting for other player to join . . .</h1>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-xl">Share the QR code or link below with your friend to join the game</h2>
            {/* <h2 className="text-xl font-bold">or simply share QR code</h2> */}
            <QRCode className="bg-white rounded-xl p-4 shadow" value={inviteUrl} />
            <span className="font-bold text-sm rounded-xl bg-white text-black p-2 shadow">{inviteUrl}</span>
          </div>
        </>
      ) : (
        <div>
          <h1>Game started</h1>
          <Game gameId={userId} userId={userId} />
        </div>
      )}
    </div>
  );
}
