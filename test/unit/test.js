import test from 'ava';
const WebSocket = require('ws');
const utils = require('../../lib/utils');

test.cb('ws will be closed without user id', t => {
  const ws = new WebSocket('ws://127.0.0.1:8080');

  ws.on('open', () => {
    utils.send(ws, 'pk', 'ready');
  });

  ws.on('close', (code, reason) => {
    t.is(code, 1000);
    t.end();
  });
});