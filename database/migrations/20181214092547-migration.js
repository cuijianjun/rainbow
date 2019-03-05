'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const {INTEGER, DATE, STRING} = Sequelize;
    // 用户表
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
    // 产品列表
    await queryInterface.createTable('product_lists', {
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      user_id: INTEGER,
      name: STRING(255),
      age: STRING(255),
      weChatName: STRING(255),
      avatar: STRING(255),
      label: STRING(255),
      description: STRING(255),
      productImage: STRING(255),
      weChatNumber: STRING(255),
      phoneNumber: STRING(255),
      dTime: DATE,
      updated_at: DATE,
    });
    // 发布产品的图片表 releaseProducts
    await queryInterface.createTable('release_products_images', {
      id: {type: INTEGER, primaryKey: true, autoIncrement: true},
      product_id: INTEGER,
      url: STRING.BINARY,
      updated_at: DATE,
      dTime: DATE
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('users');// 用户表
    await queryInterface.dropTable('product_lists'); // 产品列表
    await queryInterface.dropTable('release_products_images'); // 发布产品的图片表
  },
};