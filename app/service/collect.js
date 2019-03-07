'use strict';

const Service = require('egg').Service;

class Collect extends Service {

  async list({ user_id, product_id}) {
    const options = {
      order: [['updated_at', 'desc'], ['id', 'desc']],
    };
    if (user_id) {
      options.where = {
        user_id,
      };
    }
    if (product_id && user_id) {
      options.where = {
        product_id,
        user_id
      };
    }
    return this.ctx.model.Collect.findAll(options);
  }
  async create(collect) {
    return this.ctx.model.Collect.create(collect);
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
