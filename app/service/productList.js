'use strict';

const Service = require('egg').Service;

class ProductList extends Service {
  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.ProductList.findAndCountAll({
      offset,
      limit,
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]],
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

  async update({ id, updates }) {
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
