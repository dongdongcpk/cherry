function talk (gameServer, args) {
  return args;
}

function talk2all (gameServer, args) {
  gameServer.broadcast(args[0]);
}

function talk2multi (gameServer, args) {
  gameServer.multicast(...args);
}

module.exports = {
  talk,
  talk2all,
  talk2multi
};