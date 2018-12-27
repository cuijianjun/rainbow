# rainbow



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ mysql -u root -pcjjxw0320 -e 'CREATE DATABASE IF NOT EXISTS `database_development`;' // create database
$ npx sequelize db:migrate   // 数据库升级
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org


### 接口形式

> 域名 + 端口号 /api/功能类型/具体端口 127.0.0.1:3001/api/users/getUser
