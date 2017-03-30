const debug = require('debug')('connector');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
const gameServerClient = require('../gameServerClient/index');
// const url = require('url');

wss.on('connection', (ws) => {
  // const query = url.parse(ws.upgradeReq.url, true);
  ws.on('message', (msg) => {
    debug('send ===> ', msg);
    gameServerClient.send(msg);
  });
  
  gameServerClient.on('message', (msg) => {
    debug('receive <=== ', msg);
    ws.send(msg);
  });
});