const debug = require('debug')('gameServerClient');
const bus = require('../busmq/bus').createBus();
bus.connect();
const events = require('events');
const util = require('util');

function GameServerClient () {
  events.EventEmitter.call(this);
}

util.inherits(GameServerClient, events.EventEmitter);

GameServerClient.prototype.send = (msg) => {
  debug('send ===> ', msg);
  this.queue.push(msg);
}

GameServerClient.prototype.attachQueue = (queue) => {
  this.queue = queue;
}

const gameServerClient = new GameServerClient();

bus.on('online', () => {
  const q = bus.queue('foo');
  const s = bus.pubsub('bar');

  q.attach();
  s.subscribe();

  gameServerClient.attachQueue(q);

  s.on('message', (msg) => {
    debug('receive <=== ', msg);
    gameServerClient.emit('message', msg);
  });
});

module.exports = gameServerClient;