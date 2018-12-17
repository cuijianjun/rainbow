'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE, TEXT} = app.Sequelize;

  const ProductList = app.model.define('product_list', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    name: STRING(30),
    age: INTEGER,
    weChatName: STRING(30),
    avatar: STRING(255),
    label: STRING(30),
    description: STRING(30),
    productImage: TEXT(),
    weChatNumber: STRING(30),
    phoneNumber: STRING(30),
    created_at: DATE,
    updated_at: DATE,
  });

  return ProductList;
};
