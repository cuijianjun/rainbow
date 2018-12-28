'use strict';

const Controller = require('egg').Controller;

class ProductListController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      name: 'string',
      age: {type: 'string'},
      weChatName: 'string',
      avatar: 'string',
      label: 'string',
      description: 'string',
      productImage: 'string',
      weChatNumber: 'string',
      phoneNumber: 'string'
    };

     this.idRule = {
      id: {
        type: 'int',
        required: true
      }
    };
  }

  async index() { // post
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.request.body.limit),
      offset: ctx.helper.parseInt(ctx.request.body.offset)
    };
    // 验证参数
    ctx.validate({
      offset: {type: 'number', format: /\d+/, required: false},
      limit: {type: 'number', format: /\d+/, required: false},
    }, query);
    ctx.body = await ctx.service.productList.list(query);
  }

  async show() { // get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.query.id);
    ctx.validate(this.idRule, {
      id: id
    });
    ctx.body = await ctx.service.productList.find(id);
  }

  async create() { // post
    const ctx = this.ctx;
    ctx.validate(this.createRule, ctx.request.body);
    const product = await ctx.service.productList.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = product;
  }

  async update() { // post
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.request.body.id);
    ctx.validate(this.idRule, {
      id: id
    });
    // ctx.logger.info('some request data: %j', ctx.request.body);
    const body = ctx.request.body;
    ctx.validate(this.createRule, body);
    ctx.body = await ctx.service.productList.update({ id, updates: body });
  }

  async destroy() { // get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    console.log(id);
    if (!id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.idRule, {
      id: ctx.helper.parseInt(id)
    });

    await ctx.service.productList.del(id);
    ctx.status = 200;
  }
}

module.exports = ProductListController;
