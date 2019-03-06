'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // 用户id
    openid: STRING(255), // 微信open_id
    nickName: { type: STRING(32), defaultValue: '' }, // 姓名
    avatarUrl: STRING(256), // 头像
    province: { type: STRING(255), defaultValue: '' }, // 省份
    gender: { type: STRING(255), defaultValue: '' }, // 性别
    country: { type: STRING(255), defaultValue: '' }, // 国家
    city: { type: STRING(255), defaultValue: '' }, // 城市
    updated_at: DATE, // 更新时间
  }, {
    // 是否需要增加createdAt、updatedAt、deletedAt字段
    timestamps: true,

    // 不需要createdAt字段
    createdAt: false,

    // 将deletedAt字段改名
    // 同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    deletedAt: 'dTime',
    paranoid: true,
    underscored: true,
  });
  User.associate = function() {
    app.model.User.hasMany(app.model.ProductList, { foreignKey: 'user_id', sourceKey: 'id' });
  };
  return User;
};
