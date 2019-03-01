'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE, TEXT} = app.Sequelize;

  const ReleaseProductsImages = app.model.define('release_products_images', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    user_id: INTEGER,
    product_id: INTEGER,
    url: STRING(255),
    updated_at: DATE,
    dTime: DATE
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
    classMethods: {
      associate() {
        ReleaseProductsImages.belongsTo(app.model.User, {foreignKey: 'user_id', targetKey: 'user_id'});
        ReleaseProductsImages.belongsTo(app.model.ProductList, {foreignKey: 'product_id', targetKey: 'product_id'});
      }
    },
  });

  return ReleaseProductsImages;
};
