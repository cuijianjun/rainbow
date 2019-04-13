module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544704381372_1596';

  // add your config here
  config.middleware = ['errorHandler'];

  // ------------------------七牛云相关---------------------------
  config.accessKey = 'eSyaPaqSPcrN4Bk-EmOEjZnHaJsuFPFL84KnguaC';
  config.secretKey = 'NLBn9KldfmSAeF2dG2A2QDEd2i1pJMIJ1F8cW-3a';
  config.bucket_name = 'rainbow';
  config.zone = 'qiniu.zone.Zone_z1';
  // -------------------------微信相关---------------------------
  config.AppID = 'wxbcf2234f129139b7';
  config.AppSecret = '70c7ebe774c6cee3833e495e39f830a4';
  config.mchid = '1528758491';// 微信商户号
  config.partnerKey = 'c399862d3b9d6b76c8436e924a68c45b'; // 微信支付安全密钥
  config.notify_url = 'https://rainbow-dev.pplu.vip/api/pay/notify';// '支付回调网址',
  config.spbill_create_ip = '123.56.24.253';//  'IP地址'
  // -----------------------------------------------------------
  // token凭证
  config.jwtSecret = 'rainbow';
  // 图片url服务器
  config.baseImageUrl = 'https://res.pplu.vip/';

  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    renew: true,
    httpOnly: false,
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
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      typeCast(field, next) {
        // for reading from database
        if (field.type === 'DATE') {
          return field.string();
        }
        return next();
      }
    },
  };

  config.errorHandler = {
    match: '/api',
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG', // 终端日志
    allowDebugAtProd: true,
  };

  config.bodyParser = { // 最大长度限制
    jsonLimit: '100mb',
    formLimit: '100mb',
  };

  config.multipart = {
    mode: 'file',
    fileSize: '50mb',
    files: 10,
  };
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

  config.cluster = {
    listen: {
      port: 3002,
      hostname: '0.0.0.0',
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'database_development',
    password: '123456',
    timezone: '+08:00', // 东八时区
  };
  // 阿里云监控
  config.alinode = {
    enable: true,
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '78873',
    secret: '4cfbb86637d84ca02fe962d5537fe3701624b91d',
    logdir: '/logs/',
    "packages": [
     "/package.json"
    ],
    "disks": [
      "~/",
      "/home/cuijianjun"
    ],
  };
  return config;
};
