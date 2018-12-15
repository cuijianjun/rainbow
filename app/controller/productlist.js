'use strict';

const Controller = require('egg').Controller;

class ProductListController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    ctx.body = await ctx.service.productList.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.productList.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    console.log(JSON.stringify(ctx.request.body));
    const product = await ctx.service.productList.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = product;
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    const body = ctx.request.body;
    ctx.body = await ctx.service.productList.update({ id, updates: body });
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.productList.del(id);
    ctx.status = 200;
  }
}

module.exports = ProductListController;
