'use strict';

const Service = require('egg').Service;

class ProductList extends Service {
  async list({page = 1, limit = 10, user_id = '', label = ''}) {
    let offset = Math.abs((page - 1)) * limit;
    return this.ctx.model.ProductList.findAndCountAll({
      offset,
      limit,
      where: {user_id, label},
      order: [['updated_at', 'desc'], ['id', 'desc']],
    });
  }

  async find(id) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product;
  }

  async create(product) {
    return this.ctx.model.ProductList.create(product);
  }

  async update({id, updates}) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.update(updates);
  }

  async del(id) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.destroy();
  }
}

module.exports = ProductList;
