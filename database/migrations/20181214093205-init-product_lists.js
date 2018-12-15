'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 product_list 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('product_lists', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(30),
      age: INTEGER,
      weChatName: STRING(30),
      avatar: STRING(255),
      label: STRING(30),
      description: STRING(30),
      productImage: STRING(255),
      weChatNumber: STRING(30),
      phoneNumber: STRING(30),
      created_at: DATE,
      updated_at: DATE
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('product_lists');
  },
};
