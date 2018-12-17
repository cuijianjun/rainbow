'use strict';

const Controller = require('egg').Controller;

class ProductListController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      id: {type: 'int'},
      name: 'string',
      age: {type: 'int'},
      weChatName: 'string',
      avatar: 'string',
      label: 'string',
      description: 'string',
      productImage: 'string',
      weChatNumber: 'string',
      phoneNumber: 'number',
      created_at: 'dateTime',
      updated_at: 'dateTime',
    };

     this.idRule = {
      id: {
        type: 'int',
        required: true
      }
    };
  }

  async index() {
    const ctx = this.ctx;

    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset)
    };
    ctx.validate({
      offset: {type: 'string', format: /\d+/, required: false},
      limit: {type: 'string', format: /\d+/, required: false},
    }, query);
    ctx.body = await ctx.service.productList.list(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.productList.find(ctx.helper.parseInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(this.createRule, ctx.request.body);
    const product = await ctx.service.productList.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = product;
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.query.id;
    if (!id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.idRule, {
      id: ctx.helper.parseInt(id)
    });

    const body = ctx.request.body;
    ctx.validate(this.createRule, body);
    ctx.body = await ctx.service.productList.update(Object.assign({id}, body));
  }

  async destroy() {
    const ctx = this.ctx;
    if (!id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.idRule, {
      id: ctx.helper.parseInt(id)
    });
    const id = ctx.helper.parseInt(ctx.params.id);
    await ctx.service.productList.del(id);
    ctx.status = 200;
  }
}

module.exports = ProductListController;
