'use strict';

module.exports = appInfo => {
  const config = exports = {};
  config.cluster = {
    listen: {
      port: 3002,
      hostname: '0.0.0.0'
    },
  };
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'database_development',
    password: '123456',
  };
  return config;
};
