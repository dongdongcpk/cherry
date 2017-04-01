const WebSocket = require('ws');
const userId = '1001';
const ws = new WebSocket(`ws://127.0.0.1:8080/?userId=${userId}`);
const utils = require('../../lib/utils');

ws.on('open', () => {
  utils.send(ws, 'pk', 'ready');
});

ws.on('message', (msg) => {
  msg = utils.decode(msg);
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});