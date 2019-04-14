const Controller = require('egg').Controller;

class ProductListController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.baseImageUrl = this.app.config.baseImageUrl;
    this.type = this.app.config.type;
    this.idRule = {
      id: {
        type: 'int',
        required: true,
      },
    };
    this.queryRule = {
      product_id: {
        type: 'int',
        required: true,
      },
      user_id: {
        type: 'int',
        required: true,
      },
    };
  }

  // 用户ID 产品ID
  async placeOrder() { // post
    const ctx = this.ctx;
    const query = {
      product_id: ctx.helper.parseInt(ctx.request.body.product_id),
      user_id: ctx.helper.parseInt(ctx.request.body.user_id),
    };
    ctx.validate(this.queryRule, query);
    const body = await ctx.service.order.create(query);
    ctx.status = 201;
    ctx.body = body;
  }

  async list() { // get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.user_id);
    ctx.validate(this.idRule, {
      id,
    });
    ctx.status = 200;
    ctx.body = await ctx.service.order.list();
  }

  async update() { // post
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.request.body.id);
    ctx.validate(this.idRule, {
      id,
    });
    ctx.status = 201;
    ctx.body = await ctx.service.order.update({ id, updates: ctx.request.body });
  }

  async del() { // get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.order_id);
    if (!id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.idRule, {
      id
    });
    await ctx.service.order.del(id);
    ctx.status = 200;
  }

  async index() { // 详情get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.order_id);
    ctx.validate(this.idRule, {
      id,
    });
    let order_detail = await ctx.service.order.find(id);
    ctx.status = 200;
    ctx.body = order_detail;
  }

}

module.exports = ProductListController;
