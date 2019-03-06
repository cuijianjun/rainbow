'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE, TEXT} = app.Sequelize;

  const Banner = app.model.define('banner', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},//id
    description: {type: STRING(32), defaultValue: ''},//描述信息`
    jumpUrl: {type: STRING(256), defaultValue: ''},//跳转URL
    imageUrl: {type: STRING(256), defaultValue: ''},//图片列表
    updated_at: DATE,//更新时间
  }, {
    // 是否需要增加createdAt、updatedAt、deletedAt字段
    timestamps: true,
    // 不需要createdAt字段
    createdAt: false,
    // 将deletedAt字段改名
    // 同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    deletedAt: 'dTime',
    paranoid: true,
    underscored: true
  });
  return Banner;
};
