'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;

  const User = app.model.define('users', {
    user_id: {type: INTEGER, primaryKey: true, autoIncrement: true},//用户id
    openid: STRING(255),//微信open_id
    nickName: {type: STRING(32), allowNull: false},//姓名
    avatarUrl: STRING(256),//头像
    province: {type: STRING(255), defaultValue: ''},//省份
    gender: {type: STRING(255), defaultValue: ''},//性别
    country: {type: STRING(255), defaultValue: ''},//国家
    city: {type: STRING(255), defaultValue: ''},//城市
    created_at: DATE,//创建时间
    updated_at: DATE,//更新时间
  });

  return User;
};
