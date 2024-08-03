// Import
const Koa = require('koa');
const Router = require('koa-router');
const WebSocket = require('ws');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

// Create a new Koa application
const app = new Koa();
const router = new Router();
// In-memory storage for messages and the limit
const messageLimit = 9;
let messages = [];
var messageId = 0;

// Create an HTTP server and attach the Koa app
const server = require('http').createServer(app.callback());
// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });
// Store WebSocket clients
const clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send stored messages to the newly connected client
  // messages.forEach(message => ws.send(message));

  ws.on('message', (message, isBinary) => {
    messageId += 1;
    console.log('Received message: %s', messageId);
    // Store the message
    messages.unshift(message.toString());
    console.log('Stored message: %s', message);

    if (messageId > 9) {
      messages.pop();
    }
    // console.log(typeof(message));
    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {

      if (client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isBinary });
      };


      // console.log('Received message: %s', message);
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Middleware to parse JSON bodies
app.use(bodyParser());
app.use(cors());

// GET route to get all messages
router.get('/messages', (ctx) => {
  ctx.body = messages;
});


// // POST route to create a message
// router.post('/messages', ctx => {
//     const { message } = ctx.request.body;

//     if (!message) {
//         ctx.status = 400;
//         ctx.body = { error: 'Message content is required' };
//         return;
//     }

//     // Add the new message, displacing the oldest if necessary
//     if (messages.length >= messageLimit) {
//         const removedMessage = messages.pop();
//         notifyClients({ type: 'remove', message: removedMessage });
//         console.log('Removed message: %s', removedMessage)
//     }

//     const newMessage = { id: messages.length + 1, message };
//     messages.unshift(message);
//     console.log('Added message: %s', newMessage)
//     console.log('Current buffer: %s', messages);

//     // Notify WebSocket clients about the new message
//     notifyClients({ type: 'add', message });

//     ctx.status = 201;
//     ctx.body = { message: 'Message created' };
// });

// Apply the routes to the Koa application
app.use(router.routes()).use(router.allowedMethods());

// Broadcast message to all connected clients
function notifyClients(notification) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(notification));
        }
    });
}

// Start the Koa server on port 3000
const port = 8080;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
