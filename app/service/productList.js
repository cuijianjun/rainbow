'use strict';

const Service = require('egg').Service;

class ProductList extends Service {

  async list({page = 0, limit = 10, user_id, label}) {
    page = page >= 1 ? page - 1 : 0;
    let offset = page * limit;
    const options = {
      offset,
      limit,
      include: [{
        model: this.ctx.model.User,
        as: 'user',
        where: {
          id:user_id
        },
        attributes:['nickName']
      }],
      order: [['updated_at', 'desc'], ['id', 'desc']],
    };
    if (user_id) {
      options.where = {
        user_id,
      };
    }
    if (label) {
      options.where = {
        label,
      };
    }
    if (label && user_id) {
      options.where = {
        user_id,
        label
      };
    }
    return this.ctx.model.ProductList.findAndCountAll(options);
  }

  async find(id = 0) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product;
  }

  async create(product) {
    return this.ctx.model.ProductList.create(product);
  }

  async update({id = 0, updates}) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.update(updates);
  }

  async del(id = 0) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.destroy();
  }
}

module.exports = ProductList;
