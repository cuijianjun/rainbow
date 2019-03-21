const Controller = require('egg').Controller;

class BannerController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.baseImageUrl = this.app.config.baseImageUrl;
    this.createRule = {
      jumpUrl: {
        type: 'string',
        required: false,
      },
      description: {
        type: 'string',
        required: false,
      }
    };
    this.idRule = {
      id: {
        type: 'int',
        required: true,
      }
    };
  }

  async index() { // get
    const ctx = this.ctx;
    let banner = await ctx.service.banner.list();
    let label = await ctx.service.label.list();
    let payLoad = {
      base: this.baseImageUrl,
      filed: 'imageUrl',
      data: banner.rows
    };
    let result = ctx.helper.addBaseUrl(payLoad);
    banner['label'] = label;
    ctx.body = banner;
  }

  async create() { // post
    const {app, ctx} = this;
    ctx.validate(this.createRule, ctx.request.body);
    const files = ctx.request.files;
    let upload = '';
    let hasFiles = files.length > 0;
    if (hasFiles) {
      upload = await ctx.service.qiniu.upload();
    }
    let body = ctx.request.body;
    let create = hasFiles ? {
      ...body,
      imageUrl: JSON.stringify(upload)
    } : {
      ...body
    };
    const banner = await ctx.service.banner.create(create);
    banner.imageUrl = hasFiles? this.baseImageUrl + upload : null;
    ctx.status = 201;
    ctx.body = banner;
  }

  async update() { // post ---// todo
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.request.body.id);
    ctx.validate(this.idRule, {
      id
    });
    const files = ctx.request.files;
    let banner = await ctx.service.banner.find(id);
    if (files.length > 0) {
      const update = await ctx.service.qiniu.update([banner.dataValues.imageUrl]);
    }
    const body = ctx.request.body;
    let updates = {
      ...body,
      imageUrl: files.length > 0 ? update : banner.dataValues.imageUrl
    };
    let lastBanner = await ctx.service.banner.update({id, updates: updates});
    lastBanner.imageUrl = this.baseImageUrl + JSON.parse(banner.dataValues.imageUrl);
    ctx.status = 201;
    ctx.body = lastBanner;
  }

  async destroy() { // get ---// todo
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    if (!id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.idRule, {
      id: ctx.helper.parseInt(id),
    });
    let banner = await ctx.service.banner.find(id);
    await ctx.service.qiniu.destroy([banner.dataValues.imageUrl]);
    await ctx.service.banner.del(id);
    ctx.status = 200;
  }
}

module.exports = BannerController;
