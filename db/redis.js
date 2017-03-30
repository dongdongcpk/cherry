const Redis = require('ioredis');
const env = process.env.NODE_ENV || 'dev';
const config = require(`../config/${env}/config`);

function createRedis (options) {
  options = options || config.redisOptions;
  return new Redis(options);
}

module.exports = createRedis();