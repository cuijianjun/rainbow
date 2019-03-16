module.exports = {
  apps: [
    {
      name: 'rainbow',
      script: 'server.js',
      instances: "max",
      // exec_mode: "cluster", // 多实例多进程 可以复用端口
      env_production: {
        NODE_ENV: 'production',
        "PORT": 3001
      },
    },
    {
      name: 'rainbow-dev',
      script: 'server.js',
      instances: "max",
      env: {
        NODE_ENV: 'development',
        "PORT": 3002
      }
    }
  ],

  deploy: {
    production: {
      user: 'cuijianjun',
      host: '123.56.24.253',
      ref: 'origin/master',
      repo: 'git@github.com:cuijianjun/rainbow.git',
      path: '/work/rainbow/production',
      'pre-deploy': "git fetch",
      'post-deploy': 'npm install && npm run init-database && pm2 startOrRestart ecosystem.config.js --only rainbow',
      env: {
        NODE_ENV: 'production',
      }
    },
    dev: {
      user: 'cuijianjun',
      host: '123.56.24.253',
      ref: 'origin/dev',
      repo: 'git@github.com:cuijianjun/rainbow.git',
      path: '/work/rainbow/development',
      'pre-deploy': "git fetch",
      'post-deploy': 'npm install && npm run init-database && pm2 startOrRestart ecosystem.config.js --only rainbow-dev',
      env: {
        NODE_ENV: 'dev',
      },
    },
  },
};
