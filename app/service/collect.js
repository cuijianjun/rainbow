'use strict';

const Service = require('egg').Service;

class Collect extends Service {

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
