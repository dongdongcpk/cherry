const WebSocket = require('ws');
const userId = Math.random() * 10000 | 0;
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
  // to chat server
  for (let i = 0; i < 2; i++) {
    send(ws, 'chat', 'talk', ['hello', 'world']);
  }
  // to pk server
  for (let i = 0; i < 2; i++) {
    send(ws, 'pk', 'fight', ['game over']);
  }
  // without args
  send(ws, 'pk', 'count');
  // broadcast
  send(ws, 'chat', 'talk2all', ['this is a broadcast']);
  // multicast
  send(ws, 'chat', 'talk2multi', [['1001', '1002'], 'this is a multicast']);
});

ws.on('message', (msg) => {
  msg = _decode(msg);
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});