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

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };

  config.cluster = {
    listen: {
      port: 3001,
      hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    }
  }
  return config;
};