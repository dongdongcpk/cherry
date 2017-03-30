const debug = require('debug')('gameServerClient');
const bus = require('../busmq/bus').createBus();
const events = require('events');
const util = require('util');
const env = process.env.NODE_ENV || 'dev';
const config = require(`../../config/${env}/config`);

function GameServerClient () {
  this.queue = {};
  events.EventEmitter.call(this);
}

util.inherits(GameServerClient, events.EventEmitter);

GameServerClient.prototype.send = (msg) => {
  const args = msg.split('__');
  const serverType = args[0];
  debug('send ===> ', args);
  this.queue[serverType].push(args);
}

GameServerClient.prototype.attachQueue = (serverType, queue) => {
  if (!this.queue) {
    this.queue = {};
  }
  this.queue[serverType] = queue;
}

const gameServerClient = new GameServerClient();

bus.on('online', () => {
  // producer
  const gameServerTypes = config.gameServerTypes;
  for (let type of gameServerTypes) {
    const q = bus.queue(type);
    q.attach();
    gameServerClient.attachQueue(type, q);
  }

  const s = bus.pubsub('gameServer');
  s.subscribe();

  s.on('message', (msg) => {
    debug('receive <=== ', msg);
    gameServerClient.emit('message', msg);
  });
});

bus.connect();

module.exports = gameServerClient;