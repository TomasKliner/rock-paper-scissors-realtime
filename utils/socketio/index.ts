import { io, Socket } from 'socket.io-client';

// URL of socket-io server
const SOCKETURL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

// Singleton socket instance
const socket: Socket = io(SOCKETURL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'],
});

export default socket;