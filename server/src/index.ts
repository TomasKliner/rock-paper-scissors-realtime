import { Socket } from "socket.io-client";

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io= new Server(server);


type Game = {
  hostPlayer: string;
  guestPlayer?: string;
  gameHistory?: any[];
}
const games = new Map<string, Game>();


io.on('connection', (socket:Socket) => {
  console.log('a user connected');

  socket.on('create-game', (data) => {
    console.log('creating game');
    const gameId = socket?.id || "";
    games.set(gameId, { hostPlayer: socket?.id || ""});

    socket.emit('game-created', true);
    console.log('game-created', games.get(gameId));
    
  });

  socket.on('join-game', (data) => {
    console.log('joining game');
    const gameId = socket?.id || '';
    games.set(gameId, { hostPlayer: socket?.id || ""});

    socket.emit('game-joined', true);
    console.log('game-joined');
  });
});
  
// https://socket.io/get-started/chat
server.listen(3001, () => {
  console.log('listening on *:3001');
});