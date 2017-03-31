const WebSocket = require('ws');
const userId = '1001';
const ws = new WebSocket(`ws://127.0.0.1:8080/?userId=${userId}`);

function send (ws, serverType, func, msg) {
  msg = _encode(msg || []);
  ws.send(`${serverType}__${func}__${msg}`);
}

function _decode (msg) {
  return JSON.parse(msg);
}

function _encode (msg) {
  return JSON.stringify(msg);
}

ws.on('open', () => {
  send(ws, 'pk', 'count');
});

ws.on('message', (msg) => {
  msg = _decode(msg);
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});