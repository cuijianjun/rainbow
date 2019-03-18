

module.exports = appInfo => {
  const config = exports = {};
  config.cluster = {
    listen: {
      port: 3001,
      hostname: '0.0.0.0',
    },
  };
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'database_production',
    password: '123456',
  };
  return config;
};
