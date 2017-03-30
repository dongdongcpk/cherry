const debug = require('debug')('connector');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
const gameServerClient = require('../gameServerClient/index');

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    debug('send ===> ', msg);
    gameServerClient.send(msg);
  });
  
  gameServerClient.on('message', (msg) => {
    debug('receive <=== ', msg);
    ws.send(msg);
  });
});