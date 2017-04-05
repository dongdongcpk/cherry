function talk (gameServer, args) {
  return args;
}

function talk2all (gameServer, args) {
  gameServer.broadcast(args[0]);
  return;
}

function talk2multi (gameServer, args) {
  gameServer.multicast(...args);
  return;
}

module.exports = {
  talk,
  talk2all,
  talk2multi
};