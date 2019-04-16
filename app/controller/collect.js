const Controller = require('egg').Controller;

class CollectController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.baseImageUrl = this.app.config.baseImageUrl;
    this.queryRule = {
      user_id: {
        type: 'int',
        required: true,
      },
      product_id: {
        type: 'int',
        required: true,
      },
      isCollect: {
        type: 'boolean',
        required: true,
      },
    };
    this.idRule = {
      user_id: {
        type: 'int',
        required: true,
      }
    };
  }

  async collect() { // post
    const {app, ctx} = this;
    const query = {
      isCollect: ctx.request.body.isCollect,
      user_id: ctx.helper.parseInt(ctx.request.body.user_id),
      product_id: ctx.helper.parseInt(ctx.request.body.product_id),
    };
    ctx.validate(this.queryRule, query);
    if (ctx.request.body.isCollect) {
      await ctx.service.collect.create(query);
      ctx.status = 201;
      ctx.body = {
        message: '收藏成功',
      };
    } else {
      await ctx.service.collect.del(query);
      ctx.status = 200;
      ctx.body = {
        message: '取消收藏',
      };
    }
  }

  async list() {
    const ctx = this.ctx;
    const user_id = ctx.helper.parseInt(ctx.params.user_id);
    if (!user_id) {
      ctx.status = 404;
      ctx.body = 'user_id不能为空';
    }
    ctx.validate(this.idRule, {
      user_id
    });
    let body = await ctx.service.collect.list(user_id);
    let product_collect = await ctx.service.productList.findByIds(body);
    let _collect = [];
    product_collect.map((value, index) => {
      _collect.push(value);
    })
    let payLoad = {
      base: this.baseImageUrl,
      filed: 'productImage',
      data: _collect
    };
    let result = ctx.helper.addBaseUrl(payLoad);
    console.log(result);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = CollectController;
