const Service = require('egg').Service;

class Collect extends Service {

  async list(user_id) {
    const {ctx, app} = this;
    const options = {
      order: [['updated_at', 'desc'], ['id', 'desc']],
      where: {
        user_id,
      }
    };
    let collect =  await ctx.model.Collect.findAll(options);
    let product_ids = [];
    collect.map((value, index) => {
      product_ids.push(value.dataValues.product_id);
    });
    return product_ids;
  }
  async create(collect) {
    return await this.ctx.model.Collect.create(collect);
  }

  async del(query) {
    return await this.ctx.model.Collect.destroy({
      where:{
        ...query
      }
    });
  }
}

module.exports = Collect;
