'use strict';

const Controller = require('egg').Controller;

class ProductListController extends Controller {
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
    const query = {
      limit: ctx.helper.parseInt(ctx.request.body.limit),
      page: ctx.helper.parseInt(ctx.request.body.page),
      user_id: ctx.helper.parseInt(ctx.request.body.user_id),
      label: ctx.helper.parseInt(ctx.request.body.label)
    };
    console.log(query);
    // 验证参数
    ctx.validate({
      offset: {type: 'number', format: /\d+/, required: false},
      limit: {type: 'number', format: /\d+/, required: false},
      user_id: {type: 'number', format: /\d+/, required: false},
      label: {type: 'number', format: /\d+/, required: false}
    }, query);
    ctx.body = await ctx.service.productList.list(query);
  }

  async show() { // get
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.product_id);
    ctx.validate(this.idRule, {
      id,
    });
    let product_detail = await ctx.service.productList.find(id);
    let pageView = ctx.helper.parseInt(product_detail.dataValues.pageView) + 1;
    let product_detail_new = await ctx.service.productList.update({id, updates: {pageView: pageView}});
    ctx.body = await ctx.service.productList.find(id);
  }

  async create() { // post
    const {app, ctx} = this;
    ctx.validate(this.createRule, ctx.request.body);
    const upload = await ctx.service.qiniu.upload();
    let body = ctx.request.body;
    const product = await ctx.service.productList.create({...body, productImage: JSON.stringify(upload)});
    upload.map((value, index) => {
      value = baseImageUrl + value.key;
    });
    product.productImage = JSON.stringify(upload);
    ctx.status = 201;
    ctx.body = product;
  }

  async update() { // post
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.request.body.id);
    ctx.validate(this.idRule, {
      id,
    });

    let product = await ctx.service.productList.find(id);
    const upload = await ctx.service.qiniu.upload();
    let productImage = JSON.parse(product.dataValues.productImage);
    let diff = ctx.helper.getArrDifference(productImage, upload);
    let lastDiff = ctx.helper.getArrEqual(diff, productImage);
    // 七牛云删除
    const del = await ctx.service.qiniu.destroy(lastDiff);
    const body = ctx.request.body;
    // ctx.validate(this.createRule, body); // todo
    ctx.body = await ctx.service.productList.update({id, updates: {...body, productImage: JSON.stringify(upload)}});
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

    await ctx.service.productList.del(id);
    ctx.status = 200;
  }
}

module.exports = ProductListController;
