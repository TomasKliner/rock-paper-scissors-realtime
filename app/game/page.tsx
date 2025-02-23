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

  // console.log(client);

  const gameUrlforFriends = `${process.env.NEXT_PUBLIC_PROJECT_URL}/game/${userId}`;

  return (
    <div className="flex justify-center items-center flex-col gap-16 p-8 min-h-screen">
      <h1 className="text-4xl font-bold">Waiting for other player to join . . .</h1>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl">
          Share this link: <span className="font-bold">{gameUrlforFriends}</span>
        </h2>
        <h2 className="text-xl font-bold">or simply share QR code</h2>
        <QRCode className="bg-white rounded-xl p-4 shadow mt-2" value={gameUrlforFriends} />
      </div>
    </div>
  );
}
