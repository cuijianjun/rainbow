'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE, TEXT} = app.Sequelize;

  const ProductList = app.model.define('product_list', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    user_id: INTEGER,
    name: STRING(30),
    age: STRING(30),
    weChatName: STRING(30),
    avatar: STRING(255),
    label: STRING(30),
    description: STRING(30),
    productImage: TEXT(),
    weChatNumber: STRING(30),
    phoneNumber: STRING(30),
    updated_at: DATE,
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
        ProductList.hasMany(app.model.ReleaseProductsImages, {foreignKey: 'user_id', sourceKey: 'id'});
      },
    },
  });
  ProductList.associate = function() {
    app.model.ProductList.belongsTo(app.model.User, {foreignKey: 'user_id', targetKey: 'id'});
  };

  return ProductList;
};
