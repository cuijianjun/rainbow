'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544704381372_1596';

  // add your config here
  config.middleware = ['errorHandler'];

  // -------------------------微信相关---------------------------
  config.AppID = 'wxbcf2234f129139b7';
  config.AppSecret = '70c7ebe774c6cee3833e495e39f830a4';

  // token凭证
  config.jwtSecret = 'rainbow';
  config.session = {
    renew: true,
    httpOnly:false
  };
  config.auth = {
    test: 'tst',
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    password: '123456',
    database: 'database_development',
    timezone: '+08:00',
  };

  config.errorHandler = {
    match: '/api',
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG', // 终端日志
    allowDebugAtProd: true,
  };

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  config.maxAge = 86400000;// Session 的最大有效时间
// 关闭安全威胁csrf的防范
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 解决跨域
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // 阿里云监控
  // config.alinode = {
  //   enable: true,
  //   appid: '68663',
  //   secret: '327fbbf38c7f56fdbf2269eb57c88460c410ae00',
  // };
  config.cluster = {
    listen: {
      port: 3001,
      hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    },
  };
  return config;
};
