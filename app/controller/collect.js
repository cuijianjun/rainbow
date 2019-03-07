'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.idRule = {
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
      }
    };
  }

  async collect() { // post
    const {app, ctx} = this;
    const query = {
      isCollect:ctx.request.body.isCollect,
      user_id: ctx.helper.parseInt(ctx.request.body.user_id),
      product_id: ctx.helper.parseInt(ctx.request.body.product_id)
    };
    ctx.validate(this.idRule, query);
    if (ctx.request.body.isCollect) {
      await ctx.service.collect.create(query);
      ctx.status = 201;
      ctx.body = {
        msg:'收藏成功'
      };
    } else {
      await ctx.service.collect.del(query);
      ctx.status = 200;
      ctx.body = {
        msg:'取消收藏'
      };
    }
  }
}

module.exports = BannerController;
