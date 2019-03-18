

module.exports = app => {
  const { INTEGER, DATE, STRING } = app.Sequelize;

  const Label = app.model.define('label', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true }, // id
    labelName: STRING(), // 具体类别
    code: STRING(), // 具体类别
  }, {
    // 是否需要增加createdAt、updatedAt、deletedAt字段
    timestamps: true,
    // 不需要createdAt字段
    createdAt: false,
    // 将deletedAt字段改名
    // 同时需要设置paranoid为true（此种模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
    deletedAt: false,
    updatedAt: false,
    underscored: true,
  });
  Label.associate = function() {
    app.model.Label.belongsTo(app.model.ProductList, { foreignKey: 'code', targetKey: 'labelCode' });
  };
  return Label;
};
