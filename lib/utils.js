const utils = module.exports = {
  decode (msg) {
    return JSON.parse(msg);
  },
  encode (msg) {
    return JSON.stringify(msg);
  },
  /**
   * @param {object} ws websocket handle
   * @param {string} serverType remote server type
   * @param {string} func function which will be invoked
   * @param {array} msg message
   */
  send (ws, serverType, func, msg) {
    msg = utils.encode(msg || []);
    ws.send(`${serverType}__${func}__${msg}`);
  }
}