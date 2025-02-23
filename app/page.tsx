"use client";

import { useContext } from "react";
import SocketIoContext from "./contexts/socketioContext";
import { redirect } from "next/navigation";

export default function IndexPage() {
  //Socket IO client
  const { client } = useContext(SocketIoContext);

  const handleCreateGame = () => {
    //prepare game client connection
    client.connect();
    client.emit("createGame");
    //redirect to game page
    redirect("/game");
  };

  return (
    <div className="flex justify-evenly items-center flex-col gap-4 p-8 min-h-screen">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-black">Rock Paper Scissors</h1>
        <p className="text-lg font-bold bg-white rounded-xl p-2 shadow text-green-500 -rotate-6">
          Play with your friends!
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="bg-green-500 rounded-xl shadow p-4 font-bold border-b-8 border-r-4 border-green-600"
          onClick={() => handleCreateGame()}>
          Create new game
        </button>
        <button
          className="bg-amber-500 rounded-xl shadow p-4 font-bold border-b-8 border-r-4 border-orange-600"
          onClick={() => console.log("Join game clicked")}>
          Join game with code
        </button>
      </div>
      <a className="text-lg hover:text-neutral-200 hover:underline" href="https://github.com/TomasKliner">
        made by <span className="font-bold">https://github.com/TomasKliner</span>
      </a>
    </div>
  );
}
