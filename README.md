# cherry-pit
cherry-pit🍒 is a light-weight, scalable, distributed game server engine.

[中文文档](https://github.com/dongdongcpk/cherry/blob/master/doc/README-zh-cn.md)

## Installation
```
npm install cherry-pit -g
```
## Usage
### Initialization
```
cherry init
```
### Install dependencies
```
cd cherry
npm install
```
### Start server examples
```
npm run cherry-connector
npm run cherry-chat
npm run cherry-pk
```

same as above:

```
node lib/connector.js 8080
node app.js chat
node app.js pk
```

or start multi process:

```
node lib/connector.js 8080
node lib/connector.js 8081
node app.js chat
node app.js chat
node app.js pk
node app.js pk
```

The same type of process will automatically achieve load balancing, you can also use pm2 for process management.

### Start client examples
```
node test/helper/wsClient2.js
node test/helper/wsClient1.js
```
### Configuration
`config/dev/config.json`, `busOptions`configuration reference [here](https://capriza.github.io/node-busmq/usage/), add your logical server type to `gameServerTypes`.

```json
{
  "busOptions": {
    "driver": "ioredis",
    "layout": "",
    "redis": [
      "redis://127.0.0.1:6379"
    ]
  },
  "gameServerTypes": [
    "chat",
    "pk"
  ]
}
```

Add the service directory under `service/`.

```
├── service
│   ├── chat
│   │   └── chat.js
│   └── pk
│       └── pk.js
```
`service/chat/chat.js`, in the specific service directory to provide the interface.

```js
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
```
`app.js` is the entrance, import interface. The return value can be either promise or primitive type.

```js
const chat = require('./service/chat/chat');
const pk = require('./service/pk/pk');

let result;
try {
  switch (serverType) {
    case 'chat':
      result = chat[func](gameServer, args);
      break;
    case 'pk':
      result = pk[func](gameServer, args);
      break;
  }
}
catch (err) {
  console.error(err);
}
```

## API
### gameServer
#### Event: 'message'
* `msg` {String}

#### gameServer.send(userId, msg)
* `userId` {String}
* `msg` {Number|String|Array|Object|Promise}

#### gameServer.multicast(userIds, msg)
* `userIds` {Array}
* `msg` {Number|String|Array|Object|Promise}

#### gameServer.broadcast(msg)
* `msg` {Number|String|Array|Object|Promise}

## License
MIT License

Copyright (c) 2017 dongdonggun

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.