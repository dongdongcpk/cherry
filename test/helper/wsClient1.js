const WebSocket = require('ws');
const userId = Math.random() * 10000 | 0;
const ws = new WebSocket(`ws://127.0.0.1:8080/?userId=${userId}`);
const utils = require('../../lib/utils');

ws.on('open', () => {
  // to chat server
  utils.send(ws, 'chat', 'talk', ['hello', 'world']);

  // to pk server
  utils.send(ws, 'pk', 'fight', ['game over']);

  // without args
  utils.send(ws, 'pk', 'ready');

  // broadcast
  utils.send(ws, 'chat', 'talk2all', ['this is a broadcast']);

  // multicast
  utils.send(ws, 'chat', 'talk2multi', [['1001', '1002'], 'this is a multicast']);
});

ws.on('message', (msg) => {
  msg = utils.decode(msg);
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});