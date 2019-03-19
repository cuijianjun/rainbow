const Controller = require('egg').Controller;

class HotSearchController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.idRule = {
      id: {
        type: 'int',
        required: true,
      },
    };
  }

  async index() { // get
    const ctx = this.ctx;
    ctx.body = await ctx.service.hotSearch.list();
  }

  async create() { // post
    const { app, ctx } = this;
    const hot_search = await ctx.service.hotSearch.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = hot_search;
  }

  async update() { // post
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.request.body.id);
    ctx.validate(this.idRule, {
      id,
    });
    ctx.status = 201;
    ctx.body = await ctx.service.hotSearch.update({ id, updates: ctx.request.body });
  }

  async destroy() { // get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    if (!id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.idRule, {
      id: ctx.helper.parseInt(id),
    });
    await ctx.service.hotSearch.del(id);
    ctx.status = 200;
  }
}

module.exports = HotSearchController;
