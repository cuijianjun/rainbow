module.exports = {
  apps: [
    {
      name: 'rainbow',
      script: 'server.js',
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'rainbow-dev',
      script: 'server.js',
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: 'development',
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
      'post-deploy': 'npm install && npm run init-database && pm2 reload ecosystem.config.js --env production',
    },
    dev: {
      user: 'cuijianjun',
      host: '123.56.24.253',
      ref: 'origin/dev',
      repo: 'git@github.com:cuijianjun/rainbow.git',
      path: '/work/rainbow/development',
      'pre-deploy': "git fetch",
      'post-deploy': 'npm install && npm run init-database && pm2 reload ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev',
      },
    },
  },
};
