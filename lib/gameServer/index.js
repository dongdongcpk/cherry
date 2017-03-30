const debug = require('debug')('gameServer');
const bus = require('../busmq/bus').createBus();
bus.connect();

bus.on('online', () => {
  const q = bus.queue('foo');
  const p = bus.pubsub('bar');

  q.attach();
  q.consume();
  p.publish();

  q.on('message', (message, id) => {
    debug('receive <=== ', message, id);
    // do something
    p.publish(`feedback: ${message}`);

  });
});