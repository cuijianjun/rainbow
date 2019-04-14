

module.exports = app => {
  const { INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const Collect = app.model.define('collects', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // id
    user_id: INTEGER, // 用户ID
    product_id: INTEGER, // 产品ID
    isCollect: { type: BOOLEAN, allowNull: false, defaultValue: false }, // 是否收藏标志
    updated_at: DATE, // 更新时间
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
  return Collect;
};
