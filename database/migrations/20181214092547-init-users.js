'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const {INTEGER, DATE, STRING} = Sequelize;
    await queryInterface.createTable('users', {
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      openid: STRING(255),
      nickName: STRING(255),//姓名
      avatarUrl: STRING(255),//头像
      province: STRING(255),//省份
      gender: STRING(255),//性别
      country: STRING(255),//国家
      city: STRING(255),//城市
      updated_at: DATE,//更新时间
      dTime: DATE,//更新时间
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
