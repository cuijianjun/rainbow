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
      }
    };
    this.queryRule = {
      product_id: {
        type: 'int',
        required: true,
      },
      user_id: {
        type: 'int',
        required: true,
      }
    };
  }
  // 用户ID 产品ID
  async placeOrder() { // post
    const ctx = this.ctx;
    console.log(ctx.request.body);
    const query = {
      product_id: ctx.helper.parseInt(ctx.request.body.product_id),
      user_id: ctx.helper.parseInt(ctx.request.body.user_id),
    };
    // total_count: ctx.helper.parseInt(ctx.request.body.total_count),
    ctx.validate(this.queryRule, query);
    let body = await ctx.service.order.create(query);
    ctx.status = 201;
    ctx.body = body;

  }
  async list() { // post

  }
  async index() { // post

  }
  async del() { // post

  }

}

module.exports = ProductListController;
