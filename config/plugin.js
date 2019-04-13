// had enabled by egg
// exports.static = true;
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',

};

exports.security = {
  enable: false,
};

exports.alinode = {
  enable: true,
  package: 'egg-alinode',
};
