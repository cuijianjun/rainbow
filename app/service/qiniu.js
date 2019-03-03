'use strict';

const Service = require('egg').Service;

class Qiniu extends Service {
  async list(product_id = '') {
    console.log(product_id);
    return this.ctx.model.ReleaseProductsImages.findAndCountAll({
      where: {product_id},
      order: [['updated_at', 'desc'], ['id', 'desc']],
    });
  }

  async find(id) { // todo
    const product = await this.ctx.model.ReleaseProductsImages.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product;
  }

  async create(product) {
    return this.ctx.model.ReleaseProductsImages.create(product);
  }

  async del(product_id = '') {
    const product = await this.ctx.model.ReleaseProductsImages.findOne({
      where:{product_id}
    });
    console.log(product);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.destroy();
  }
}

module.exports = Qiniu;
