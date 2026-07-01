const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let teams = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Send current teams to new client
  socket.emit('teams', teams);

  socket.on('updateTeams', (newTeams) => {
    teams = newTeams;
    io.emit('teams', teams); // Broadcast updated teams to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
