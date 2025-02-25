import { Socket } from "socket.io";

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
  hostMove?: Move;
  guestMove?: Move;
  winner?: Outcome;
};

// Main game type
type Game = {
  hostPlayer: string;
  guestPlayer: string | null; // null when no guest has joined
  currentRound: Round;
  gameHistory: Round[];
};

const games = new Map<string, Game>();

const playersActiveConnections = new Map<string, string>();

io.on('connection', (socket: Socket) => {
  console.log('new socket connection', socket.id);

  socket.on('create-game', (userId) => {
    console.log('creating game');
    playersActiveConnections.set(userId, socket.id);
    
    // Create game room with userId as room name
    socket.join(userId);
    
    games.set(userId, { 
      hostPlayer: userId, 
      guestPlayer: null, 
      currentRound: {}, 
      gameHistory: [] 
    });
    
    socket.emit('game-created', true);
    console.log('game-created', games.get(userId));
  });

  socket.on('join-game', ({gameId, userId}) => {
    console.log('joining game');
    playersActiveConnections.set(userId, socket.id);

    const game = games.get(gameId);
    if (game) {
      // Join the game room
      socket.join(gameId);
      games.set(gameId, { ...game, guestPlayer: userId || "" });
      
      // Emit to all players in the room
      io.to(gameId).emit('game-started', {
        gameId,
        players: {
          host: game.hostPlayer,
          guest: userId
        }
      });
    } else {
      console.log('game not found');
      socket.emit('game-not-found');
      return;
    }

    socket.emit('game-joined', true);
    console.log('game-joined', games.get(gameId));
  });

  // Example of game move broadcasting
  socket.on('make-move', ({ gameId, userId, move }) => {
    const game = games.get(gameId);
    if (!game) return;
    
    // Add move validation
    if (game.currentRound.hostMove && userId === game.hostPlayer) {
      return; // Host already moved
    }
    if (game.currentRound.guestMove && userId === game.guestPlayer) {
      return; // Guest already moved
    }
    
    // Update the current round with the player's move
    if (userId === game.hostPlayer) {
      game.currentRound.hostMove = move;
    } else if (userId === game.guestPlayer) {
      game.currentRound.guestMove = move;
    }

    // Save the updated game state
    games.set(gameId, game);

    // Broadcast the move to all players in the game
    io.to(gameId).emit('move-made', {
      player: userId,
      move: move
    });

    // Check if both players moved to determine winner
    if (game.currentRound.hostMove && game.currentRound.guestMove) {
      if(game.currentRound.hostMove === game.currentRound.guestMove) {
        game.currentRound.winner = 'DRAW';
      }
      else if (
        (game.currentRound.hostMove === 'ROCK' && game.currentRound.guestMove === 'SCISSORS') ||
        (game.currentRound.hostMove === 'PAPER' && game.currentRound.guestMove === 'ROCK') ||
        (game.currentRound.hostMove === 'SCISSORS' && game.currentRound.guestMove === 'PAPER')
      ) {
        game.currentRound.winner = 'HOST_WIN';
      }
      else {
        game.currentRound.winner = 'GUEST_WIN';
      }


      io.to(gameId).emit('round-ended', {
        winner: game.currentRound.winner,
        moves: {
          host: game.currentRound.hostMove,
          guest: game.currentRound.guestMove,
        },
      });

      // Save the round to the game history
      game.gameHistory.push(game.currentRound);
      game.currentRound = {};


    }
  });

  // Clean up when player disconnects
  socket.on('disconnect', () => {
    // Find and leave game rooms
    socket.rooms.forEach(room => {
      if (games.has(room)) {
        io.to(room).emit('player-disconnected', socket.id);
      }
    });
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});