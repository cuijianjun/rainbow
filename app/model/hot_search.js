'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const HotSearch = app.model.define('hot_search', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // id
    hot_search: STRING(), // 具体数据
    updated_at: DATE
  }, {
    // 是否需要增加createdAt、updatedAt、deletedAt字段
    timestamps: true,
    // 不需要createdAt字段
    createdAt: false,
    // 将deletedAt字段改名
    // 同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    deletedAt: 'dTime',
    underscored: true,
  });
  return HotSearch;
};
