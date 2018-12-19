'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544704381372_1596';

  // add your config here
  config.middleware = ['errorHandler'];

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'database_development',
  };

  config.errorHandler = {
    match: '/api'
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',// 终端日志
    allowDebugAtProd: true,
  };

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  config.maxAge = 86400000;// Session 的最大有效时间

  config.cluster = {
    listen: {
      port: 3001,
      hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    }
  };
  return config;
};
