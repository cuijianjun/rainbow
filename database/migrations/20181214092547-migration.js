'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, BOOLEAN, TEXT } = Sequelize;
    // 用户表
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      openid: STRING(255),
      nickName: STRING(255), // 姓名
      avatarUrl: STRING(255), // 头像
      province: STRING(255), // 省份
      gender: STRING(255), // 性别
      country: STRING(255), // 国家
      city: STRING(255), // 城市
      updated_at: DATE, // 更新时间
      dTime: DATE, // 删除时间
    });
    // 产品列表
    await queryInterface.createTable('product_lists', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: INTEGER,
      name: STRING(255),
      age: STRING(255),
      labelCode: STRING(255),
      description: TEXT(),
      productImage: STRING(255),
      pageView: { type: STRING(30), defaultValue: 0 },
      weChatNumber: STRING(255),
      phoneNumber: STRING(255),
      dTime: DATE,
      updated_at: DATE,
    });
    // banner图 + 类别
    await queryInterface.createTable('banners', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      description: STRING(255),
      jumpUrl: STRING(255),
      imageUrl: STRING(255),
      updated_at: DATE,
      dTime: DATE,
    });
    // 收藏表 Collection
    await queryInterface.createTable('collects', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: INTEGER,
      product_id: INTEGER,
      isCollect: { type: BOOLEAN, allowNull: false, defaultValue: false},
      updated_at: DATE
    });
    // HotSearch
    await queryInterface.createTable('hot_searches', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      hot_search: STRING(),
      updated_at: DATE
    });

    // label
    await queryInterface.createTable('labels', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      labelName: STRING(),
      code: STRING()
    });

  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('users');// 用户表
    await queryInterface.dropTable('product_lists'); // 产品列表
    await queryInterface.dropTable('banners'); // banner图 + 类别
    await queryInterface.dropTable('collects'); // 收藏表
    await queryInterface.dropTable('hot_searches'); // HotSearch
    await queryInterface.dropTable('labels'); // label
  },
};
