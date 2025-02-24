import { Socket } from "socket.io-client";

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Define valid moves
type Move = 'ROCK' | 'PAPER' | 'SCISSORS';

// Define possible game outcomes
type Outcome = 'HOST_WIN' | 'GUEST_WIN' | 'DRAW';

// Define a round structure
type Round = {
  hostMove: Move;
  guestMove: Move;
  winner: Outcome;
};

// Main game type
type Game = {
  hostPlayer: string;
  guestPlayer: string | null; // null when no guest has joined
  currentRound: {
    hostMove?: Move;
    guestMove?: Move;
    winner?: Outcome;
  };
  gameHistory: Round[];
};

const games = new Map<string, Game>();

const playersActiveConnections = new Map<string, string>();

io.on('connection', (socket: Socket) => {
  console.log('new socket connection', socket.id);

  socket.on('create-game', (userId) => {
    console.log('creating game');
    // Save the user id and socket id
    playersActiveConnections.set(userId, socket.id);
    // Create a new game with the user as host
    games.set(userId, { hostPlayer: userId, guestPlayer: null, currentRound: {}, gameHistory: [] });
    // Emit the game-created event to the user
    socket.emit('game-created', true);
    console.log('game-created', games.get(userId));


  });

  socket.on('join-game', (data) => {
    console.log('joining game');
    const gameId = data?.gameId ?? "";

    const game = games.get(gameId);
    if (game) {
      games.set(gameId, { ...game, guestPlayer: socket?.id || "" });
    }
    else {
      console.log('game not found');
      socket.emit('game-not-found');
      return;
    }

    socket.emit('game-joined', true);
    console.log('game-joined');
  });

});

server.listen(3001, () => {
  console.log('listening on *:3001');
});