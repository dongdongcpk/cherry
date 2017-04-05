const cherry = require('./cherry');
const gameServer = cherry.gameServer;
const chat = require('./service/chat/chat');
const pk = require('./service/pk/pk');

gameServer.on('message', (msg) => {
  const [userId, serverType, func, args] = msg;
  let result;
  try {
    switch (serverType) {
      case 'chat':
        result = chat[func](gameServer, args);
        break;
      case 'pk':
        result = pk[func](gameServer, args);
        break;
    }
  }
  catch (err) {
    console.error(err);
  }
  if (result) {
    Promise.resolve(result)
      .then(res => {
        if (res) gameServer.send(userId, res);
      })
      .catch(error => {
        console.error(error);
      });
  }
});