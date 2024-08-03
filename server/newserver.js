// server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = []; // Array to store messages

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send stored messages to the newly connected client
  messages.forEach(message => ws.send(message));

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Store the message
    messages.push(message);
    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on ws://localhost:8080');
});
