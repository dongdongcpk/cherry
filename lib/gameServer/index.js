const debug = require('debug')('gameServer');
const bus = require('../busmq/bus').createBus();
const events = require('events');
const util = require('util');
const env = process.env.NODE_ENV || 'dev';
const config = require(`../../config/${env}/config`);
const args = process.argv.splice(2);
const serverType = args[0];

function GameServer () {
  events.EventEmitter.call(this);
}

util.inherits(GameServer, events.EventEmitter);

GameServer.prototype.send = (msg) => {
  debug('send ===> ', msg);
  this.pub.publish(`feedback: ${msg}`);
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
    msg = decode(msg);
    gameServer.emit('message', msg);
  });

  const p = bus.pubsub('gameServer');
  p.publish();
  gameServer.attachPub(p);
});

bus.connect();

function decode (msg) {
  return JSON.parse(msg);
}

module.exports = gameServer;