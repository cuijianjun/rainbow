'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {
  constructor(ctx) {
    super(ctx);
    const baseImageUrl = this.app.config.baseImageUrl;
    this.createRule = {
      name: 'string',
      age: {type: 'string'},
      user_id: {type: 'string'},
      weChatName: 'string',
      avatar: 'string',
      label: 'string',
      description: 'string',
      weChatNumber: 'string',
      phoneNumber: 'string',
    };
    this.idRule = {
      id: {
        type: 'int',
        required: true,
      }
    };
  }

  async index() { // post
    const ctx = this.ctx;
    ctx.body = await ctx.service.banner.list();
  }
}

module.exports = BannerController;
