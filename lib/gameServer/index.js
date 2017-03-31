const debug = require('debug')('gameServer');
const bus = require('../busmq/bus').createBus();
const events = require('events');
const util = require('util');
const env = process.env.NODE_ENV || 'dev';
const config = require(`../../config/${env}/config`);
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
  msg = _encode(msg);
  msg = `${MSG_TYPE.RESPONSE}__${msg}__${userId}`;
  debug('send ===> ', msg);
  this.pub.publish(msg);
}

GameServer.prototype.broadcast = (msg) => {
  msg = _encode(msg);
  msg = `${MSG_TYPE.BROADCAST}__${msg}`;
  debug('broadcast ===> ', msg);
  this.pub.publish(msg);
}

GameServer.prototype.multicast = (userIds, msg) => {
  msg = _encode(msg);
  msg = `${MSG_TYPE.MULTICAST}__${msg}__${_encode(userIds)}`;
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
    msg = _decode(msg);
    msg[3] = _decode(msg[3]);
    gameServer.emit('message', msg);
  });

  const p = bus.pubsub('gameServer');
  p.publish();
  gameServer.attachPub(p);
});

bus.connect();

function _decode (msg) {
  return JSON.parse(msg);
}

function _encode (msg) {
  return JSON.stringify(msg);
}

module.exports = gameServer;