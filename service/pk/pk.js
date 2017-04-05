function fight (gameServer, args) {
  return Promise.resolve(args);
}

function ready (gameServer, args) {
  return 'I am ready';
}

module.exports = {
  fight,
  ready
};