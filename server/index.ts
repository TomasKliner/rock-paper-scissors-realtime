const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req:any, res:any) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket:any) => {
  console.log('a user connected');
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});