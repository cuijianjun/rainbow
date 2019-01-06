# rainbow



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run init-database // create database
$ npm run dev
$ open http://localhost:3001/
```

### Deploy

```bash
$ pm2
pm2 deploy ecosystem.config.js production setup 初次上传代码
pm2 deploy ecosystem.config.js production // 上传代码并部署（以后）
$ webhook
localhost:8888/deploy  在push时候触发 服务器同步代码并重启

以上都部署开机自动重启服务

start up
pm2 start server.js -n rainbow --watch='app config database deploy'  --ignore-watch='node_modules logs run'
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org


### 接口形式

> 域名 + 端口号 /api/功能类型/具体端口 eg:127.0.0.1:3001/api/users/getUser
