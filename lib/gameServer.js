const debug = require('debug')('cherry:gameServer');
const bus = require('./bus')();
const events = require('events');
const util = require('util');
const utils = require('./utils');
const args = process.argv.splice(2);
const serverType = args[0];
const MSG_TYPE = {
  RESPONSE: 0,
  BROADCAST: 1,
  MULTICAST: 2
};

function GameServer () {
  events.EventEmitter.call(this);
}

util.inherits(GameServer, events.EventEmitter);

GameServer.prototype.send = (userId, msg) => {
  msg = utils.encode(msg);
  msg = `${MSG_TYPE.RESPONSE}__${msg}__${userId}`;
  debug('send ===> ', msg);
  this.pub.publish(msg);
}

GameServer.prototype.broadcast = (msg) => {
  msg = utils.encode(msg);
  msg = `${MSG_TYPE.BROADCAST}__${msg}`;
  debug('broadcast ===> ', msg);
  this.pub.publish(msg);
}

GameServer.prototype.multicast = (userIds, msg) => {
  msg = utils.encode(msg);
  msg = `${MSG_TYPE.MULTICAST}__${msg}__${utils.encode(userIds)}`;
  debug('multicast ===> ', msg);
  this.pub.publish(msg);
}

GameServer.prototype.attachPub = (pub) => {
  this.pub = pub;
}

const gameServer = new GameServer();

bus.on('online', () => {
  // consumer
  const q = bus.queue(serverType);
  q.attach();
  q.consume();

  q.on('message', (msg, id) => {
    debug(`${serverType} receive <=== `, msg, id);
    msg = utils.decode(msg);
    try {
      msg[3] = utils.decode(msg[3]);
    }
    catch (err) {
      console.error(err);
      return;
    }
    gameServer.emit('message', msg);
  });

  const p = bus.pubsub('gameServer');
  p.publish();
  gameServer.attachPub(p);
});

bus.connect();

module.exports = gameServer;