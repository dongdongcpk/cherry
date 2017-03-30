const WebSocket = require('ws');
const userId = 1001;
const ws = new WebSocket(`ws://127.0.0.1:8080/?userId=${userId}`);

function send (ws, serverType, func, msg) {
  msg = encode(msg);
  ws.send(`${serverType}__${func}__${msg}`);
}

function encode (msg) {
  return JSON.stringify(msg);
}

ws.on('open', () => {
  for (let i = 0; i < 2; i++) {
    send(ws, 'chat', 'talk', ['hello', 'world']);
  }
  for (let i = 0; i < 2; i++) {
    send(ws, 'pk', 'fight', ['game over']);
  }
});

ws.on('message', (msg) => {
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});