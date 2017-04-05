const cherry = require('./cherry');
const gameServer = cherry.gameServer;
const chat = require('./service/chat/chat');
const pk = require('./service/pk/pk');

gameServer.on('message', (msg) => {
  const [userId, serverType, func, args] = msg;
  let res;
  try {
    switch (serverType) {
      case 'chat':
        res = chat[func](gameServer, args);
        break;
      case 'pk':
        res = pk[func](gameServer, args);
        break;
    }
  }
  catch (err) {
    console.error(err);
  }
  if (res) {
    gameServer.send(userId, res);
  }
});