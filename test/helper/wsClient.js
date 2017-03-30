const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:8080');

ws.on('open', () => {
  for (let i = 0; i < 5; i++) {
    ws.send('hello world');
  }
});

ws.on('message', (msg) => {
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});