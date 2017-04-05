# Cherry
Cherry是一个轻量的、可伸缩的、分布式多进程游戏框架。

## 安装
```
npm install
```

## 用法
### 安装依赖
```
cd cherry
npm install
```
### 启动示例服务端
```
npm run cherry-connector
npm run cherry-chat
npm run cherry-pk
```
### 启动示例客户端
```
node test/helper/wsClient2.js
node test/helper/wsClient1.js
```
### 配置
`config/dev/config.json`，`busOptions`的配置参考[这里](https://capriza.github.io/node-busmq/usage/)，在`gameServerTypes `中增加你的逻辑服务器类型。

```
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
在`service/`下增加对应的服务目录。

```
├── service
│   ├── chat
│   │   └── chat.js
│   └── pk
│       └── pk.js
```
`service/chat/chat.js`，在具体的服务目录下提供接口。

```
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
`app.js`，入口文件，引入接口。

```
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
### API
#### gameServer
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