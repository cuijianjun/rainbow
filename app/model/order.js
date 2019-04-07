module.exports = app => {
  const {STRING, INTEGER, DATE, TEXT} = app.Sequelize;
  const Order = app.model.define('order', {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    order_no: STRING(20),
    user_id: INTEGER,
    total_price: INTEGER,
    status: INTEGER,
    snap_img: STRING(255),
    snap_name: STRING(80),
    total_count: INTEGER,
    snap_url: TEXT(),
    price: INTEGER,
    snap_address: STRING(500),
    prepay_id: STRING(100),
    updated_at: DATE
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
  // ProductList.associate = function() {
  //   app.model.ProductList.belongsTo(app.model.User, { foreignKey: 'user_id', targetKey: 'id' });
  // };

  return Order;
};
