"use client";

import { useContext, useEffect, useState } from "react";
import SocketIoContext from "../contexts/socketioContext";
import QRCode from "react-qr-code";

export default function GamePage() {
  const { client } = useContext(SocketIoContext);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    client.on("connect", (data) => {
      setUserId(client?.id);
    });

    client.on("game-created", (data) => {
      console.log("game-created-data", data);
    });

    return () => {
      client.off("connect");
      client.off("game-created");
    };
  }, [client]);

  console.log(client);

  return (
    <div className="flex justify-center items-center flex-col gap-4 p-8 min-h-screen">
      <button className="bg-blue-500 rounded-xl shadow p-4 font-bold" onClick={() => client.emit("create-game")}>Create Game</button>
      <button className="bg-green-500 rounded-xl shadow p-4 font-bold" onClick={() => client.emit("join-game")}>Join Game</button>
      <div className="text-lg font-bold">User ID: {userId}</div>
      <QRCode className="bg-white rounded-xl p-4 shadow" value={userId} />
    </div>
  );
}
