'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 product_list 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('product_lists', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
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
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('product_lists');
  },
};
