const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({type: "connect", color: getRandomColor()}));
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({type: "userCountChanged", userCount: wss.clients.size}));
  });

  ws.on('message', (data) => {
    data = JSON.parse(data);
    const message = {content: data.content};
    switch (data.type) {
      case "postMessage":
        console.log(`User ${data.username} said ${data.content}`);
        message.id = uuidv1();
        message.username = data.username;
        message.type = "incomingMessage";
        message.color = data.color;
        break;
      case "postNotification":
        message.type = "incomingNotification";
        message.id = uuidv1();
        break;
      default:
        throw new Error("Unknown data type " + data.type);
    }
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({type: "userCountChanged", userCount: wss.clients.size}));
    });
  });

});
