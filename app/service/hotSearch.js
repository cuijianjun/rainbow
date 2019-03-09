'use strict';

const Service = require('egg').Service;

class HotSearch extends Service {

  async list() {
    return await this.ctx.model.HotSearch.findAll();
  }

  async create(banner) {
    return this.ctx.model.HotSearch.create(banner);
  }

  async update({ id = 0, updates }) {
    const HotSearch = await this.ctx.model.HotSearch.findById(id);
    if (!HotSearch) {
      this.ctx.throw(404, 'HotSearch not found');
    }
    return HotSearch.update(updates);
  }

  async del(id = 0) {
    const HotSearch = await this.ctx.model.HotSearch.findById(id);
    if (!HotSearch) {
      this.ctx.throw(404, 'HotSearch not found');
    }
    return HotSearch.destroy();
  }
}

module.exports = HotSearch;
