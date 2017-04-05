const debug = require('debug')('cherry:connector');
const args = process.argv.splice(2);
const port = args[0];
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port });
const gameServerClient = require('./gameServerClient');
const url = require('url');
const users = new Map();

wss.on('connection', (ws) => {

  ws.on('close', (code, reason) => {
    debug('ws close: ', code, reason);
    const userId = _parseUserId(ws);
    if (userId) {
      _unbindUser(userId);
    }
  });

  ws.on('error', (error) => {
    console.error(error);
  });

  ws.on('message', (msg) => {
    debug('send ===> ', msg);
    const userId = _parseUserId(ws);
    if (!userId) {
      ws.close(0, 'reject the connection without user id');
      return;
    }
    if (_isNewSocket(userId, ws)) {
      _bindUser(userId, ws);
    }
    gameServerClient.send(userId, msg);
  });
  
});

gameServerClient.on('message', (userId, msg) => {
  debug('receive msg <=== ', msg);
  _send(userId, msg);
});

gameServerClient.on('broadcast', (msg) => {
  debug('receive broadcast <=== ', msg);
  _broadcast(msg);
});

gameServerClient.on('multicast', (userIds, msg) => {
  debug('receive multicast <=== ', msg);
  _multicast(userIds, msg);
});

function _parseUserId (ws) {
  const query = url.parse(ws.upgradeReq.url, true).query;
  return query.userId;
}

function _bindUser (userId, ws) {
  users.set(userId, ws);
}

function _unbindUser (userId) {
  if (users.has(userId)) {
    users.delete(userId);
  }
}

function _isOffline (userId) {
  return !users.has(userId);
}

function _isNewSocket (userId, ws) {
  if (_isOffline(userId)) {
    return true;
  }
  const oldWs = _getUserSocket(userId);
  return ws !== oldWs;
}

function _getUserSocket (userId) {
  return users.get(userId);
}

function _send (userId, msg) {
  const ws = _getUserSocket(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
  }
}

function _broadcast (msg) {
  for (let client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

function _multicast (userIds, msg) {
  for (let userId of userIds) {
    const ws = _getUserSocket(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}
