const Controller = require('egg').Controller;

class ProductListController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.baseImageUrl = this.app.config.baseImageUrl;
    this.type = this.app.config.type;
    this.createRule = {
      name: {type: 'string', required: false},
      age: {type: 'string', required: false},
      user_id: {type: 'string'},
      labelCode: 'string',
      description: {type: 'string', required: false},
      phoneNumber: 'string',
      price: 'string',
      address: 'string',
      detailAddress: 'string',
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
    const query = {
      limit: ctx.helper.parseInt(ctx.request.body.limit),
      page: ctx.helper.parseInt(ctx.request.body.page),
      user_id: ctx.helper.parseInt(ctx.request.body.user_id),
      searchQuery: ctx.request.body.searchQuery,
      labelCode: ctx.helper.parseInt(ctx.request.body.labelCode)
    };
    let body = await ctx.service.productList.list(query);
    let payLoad = {
      base: this.baseImageUrl,
      filed: 'productImage',
      data: body.rows
    };
    let result = ctx.helper.addBaseUrl(payLoad);
    ctx.status = 201;
    ctx.body = result;
  }

  async show() { // get 详情
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.product_id);
    ctx.validate(this.idRule, {
      id,
    });
    // 浏览量加1
    let product_detail = await ctx.service.productList.find(id);
    let pageView = ctx.helper.parseInt(product_detail.dataValues.pageView) + 1;
    let product_detail_new = await ctx.service.productList.update({id, updates: {pageView: pageView}});

    // 获取收藏状态
    let user_id = ctx.helper.parseInt(ctx.params.user_id);
    let isCollect = false;
    if (typeof user_id === 'number') {
      let product_id = [];
      let collect = await ctx.service.collect.list({user_id});
      collect.map((value) => {
        // 收藏
        product_id.push(value.dataValues.product_id);
      });
      isCollect = product_id.includes(id);
    }
    let body = await ctx.service.productList.find(id);
    let payLoad = {
      base: this.baseImageUrl,
      filed: 'productImage',
      data: body.dataValues
    };
    let result = ctx.helper.addBaseUrl(payLoad);
    body.dataValues.collect = {
      isCollect
    };
    ctx.status = 200;
    ctx.body = result;
  }

  async create() { // post
    const {app, ctx} = this;
    ctx.validate(this.createRule, ctx.request.body);
    let body = ctx.request.body;
    const product = await ctx.service.productList.create({...body});
    ctx.status = 201;
    ctx.body = {
      message: 'create success'
    };
  }

  async update() { // post
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.request.body.id);
    ctx.validate(this.idRule, {
      id,
    });
    const body = ctx.request.body;
    ctx.body = await ctx.service.productList.update({id, updates: body});
  }

  async updateTime() { // post
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.validate(this.idRule, {
      id,
    });
    ctx.body = await ctx.service.productList.updateTime({id});
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
    let body = await ctx.service.productList.find(id);
    let image = body.dataValues['productImage'].split(',');
    const del = await ctx.service.qiniu.destroy(image);
    await ctx.service.productList.del(id);
    ctx.status = 200;
    ctx.body = {
      message: 'delete product success'
    }
  }
}

module.exports = ProductListController;
