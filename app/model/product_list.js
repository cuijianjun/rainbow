
module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const ProductList = app.model.define('product_list', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: INTEGER,
    title: STRING(255),
    labelCode: STRING(30),
    description: TEXT(),
    productImage: TEXT(),
    pageView: { type: STRING(30), defaultValue: 0 },
    price: STRING(30),
    address: STRING(255),
    city:STRING(255),
    phoneNumber: STRING(30),
    updated_at: {
      type: DATE,
      get() {
        const dateText = this.getDataValue('updated_at').toString();
        return +new Date(dateText);
      }
    }
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
  });
  ProductList.associate = function() {
    app.model.ProductList.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
    app.model.ProductList.hasMany(app.model.Label, { foreignKey: 'code', sourceKey: 'labelCode' });
  };

  return ProductList;
};
