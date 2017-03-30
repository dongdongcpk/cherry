const Bus = require('busmq');
const env = process.env.NODE_ENV || 'dev';
const config = require(`../../config/${env}/config`);

function createBus (options) {
  options = options || config.busOptions;
  return Bus.create(options);
}

module.exports = {
  createBus
};