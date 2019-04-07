const Service = require('egg').Service;

class ProductList extends Service {
  constructor(ctx) {
    super(ctx);
    this.baseImageUrl = this.app.config.baseImageUrl;
  }

  async create({product_id, user_id, total_count = 1}) {
    const ctx = this.ctx;
    this.product_id = product_id;
    this.user_id = user_id;
    this.total_count = total_count;
    await this.getProduct(product_id);
    await this.getUser(user_id);
    return await this.snapOrder();
  }

  async list() {

  }

  async index() {

  }

  async del() {

  }

  async getProduct(product_id) {
    // 查询产品
    const product = await this.ctx.model.ProductList.findOne({product_id});
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    this.product = product
  }

  async getUser(user_id) {
    // 查询用户
    const user = await this.ctx.model.User.findOne({user_id});
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    this.user = user
  }

  async snapOrder() {
    // 生成订单号
    let order_no = this.ctx.helper.generate();
    let product_detail = this.product.dataValues;
    let user_detail = this.user.dataValues;
    const snap_img = this.baseImageUrl + product_detail.productImage.split(',')[0];
    let data = {
      order_no: order_no, // '订单号'
      user_id: this.user_id, // '外键，用户id，注意并不是openid'
      total_price: this.ctx.helper.parseInt(product_detail.price) * this.total_count, // 订单总价
      status: 1, // '1:未支付， 2：已支付'
      price: this.ctx.helper.parseInt(product_detail.price),
      snap_img: snap_img, // '订单快照图片'
      total_count: this.total_count, // 订单总数量
      snap_name: product_detail.title, // '订单名称'
      snap_address: '', // '地址快照'
      prepay_id: '', // '订单微信支付的预订单id（用于发送模板消息）'
    };
    let lastData = await this.ctx.model.Order.create(data);
    lastData.dataValues.tel = user_detail.tel;
    return lastData;
  }
}

module.exports = ProductList;