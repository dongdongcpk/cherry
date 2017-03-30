const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:8080');

ws.on('open', () => {
  for (let i = 0; i < 2; i++) {
    ws.send(JSON.stringify([
      'chat', // server type
      'talk', // function
      ['hello world', ''] // args
    ]));
  }
  for (let i = 0; i < 2; i++) {
    ws.send(JSON.stringify([
      'battle', // server type
      'pk', // function
      ['game over'] // args
    ]));
  }
});

ws.on('message', (msg) => {
  console.log(msg);
});

ws.on('error', (error) => {
  console.error(error);
});