const debug = require('debug')('cherry:gameServerClient');
const bus = require('./bus')();
const events = require('events');
const util = require('util');
const env = process.env.NODE_ENV || 'dev';
const config = require(`../config/${env}/config`);
const utils = require('./utils');
const MSG_TYPE = {
  RESPONSE: 0,
  BROADCAST: 1,
  MULTICAST: 2
};

function GameServerClient () {
  this.queue = {};
  events.EventEmitter.call(this);
}

util.inherits(GameServerClient, events.EventEmitter);

GameServerClient.prototype.send = (userId, msg) => {
  let args = msg.split('__');
  if (args.length !== 3) {
    throw new Error('argument length is error');
  }
  const serverType = args[0];
  args = [userId].concat(args);
  debug('send ===> ', args);
  if (!this.queue[serverType]) {
    throw new Error('server type is error');
  }
  this.queue[serverType].push(args);
}

GameServerClient.prototype.attachQueue = (serverType, queue) => {
  this.queue = this.queue || {};
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
    handleMsg(msg);
  });
});

bus.connect();

function handleMsg (msg) {
  const [msgType, realMsg, options] = msg.split('__');
  switch (+msgType) {
    case MSG_TYPE.RESPONSE:
      gameServerClient.emit('message', options, realMsg);
      break;
    case MSG_TYPE.BROADCAST:
      gameServerClient.emit('broadcast', realMsg);
      break;
    case MSG_TYPE.MULTICAST:
      gameServerClient.emit('multicast', utils.decode(options), realMsg);
      break;
  }
}

module.exports = gameServerClient;