'use strict';

const Service = require('egg').Service;

class ProductList extends Service {

  async list() {
    return this.ctx.model.ProductList.findAndCountAll();
  }
}

module.exports = ProductList;
