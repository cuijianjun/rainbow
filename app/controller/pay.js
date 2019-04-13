const Controller = require('egg').Controller;
const tenpay = require('tenpay');
const fs = require('fs');
const xml2js = require('xml2js').parseString;


class PayController extends Controller {
  constructor(ctx) {
    super(ctx);
    const defaultConfig = this.app.config;
    const config = {
      appid: defaultConfig.AppID,
      mchid: defaultConfig.mchid,
      partnerKey: defaultConfig.partnerKey,
      notify_url: defaultConfig.notify_url,
      // spbill_create_ip: defaultConfig.spbill_create_ip,
      pfx: fs.readFileSync(__dirname + '/apiclient_cert.p12'),
    };
    // 调试模式(传入第二个参数为true, 可在控制台输出数据)
    this.api = new tenpay(config, true);
  }

  async unifiedOrder() { // post 统一下单接口
    const {app, ctx} = this;
    const {total_price, user_id, order_id} = ctx.request.body;
    let openid = await this.getOpenId(user_id);
    let out_trade_no = await this.getOutTradeNo(order_id);
    let result = await this.api.unifiedOrder({
      out_trade_no: out_trade_no,
      body: '充值',
      total_fee: total_price * 100, // todo
      openid: openid
    });
    let data = this.api.getPayParamsByPrepay({
      prepay_id: result.prepay_id,
    });
    ctx.status = 200;
    ctx.body = data;
  }

  async getOpenId (user_id) {
    const {app, ctx} = this;
    let user = await ctx.service.order.getUser(user_id);
    const openid = user.dataValues.openid;
    if (!openid) {
      ctx.status = 404;
      ctx.body = {
        message: '对不起, 请授权登录'
      };
    }
    return openid;
  }

  async getOutTradeNo (order_id) {
    const {app, ctx} = this;
    let product = await ctx.service.order.find(order_id);
    const out_trade_no = product.dataValues.order_no;
    if (!out_trade_no) {
      ctx.status = 404;
      ctx.body = {
        message: '对不起, 请确认商品准确性'
      };
    }
    return out_trade_no;
  }

  async notify() { // 回调通知
    const {app, ctx} = this;
    let data = '';
    let json = {};
    ctx.req.setEncoding('utf8');
    ctx.req.on('data',function(chunk){
      data += chunk;
    });
    console.log(data);
    ctx.req.on('end',function() {
      xml2js(data, {explicitArray: false}, function (err, json) {
        console.log(json);//这里的json便是xml转为json的内容
        ctx.body = 'success';
      });
    });
  }

  async orderQuery() { // 查询订单
    let result = await this.api.orderQuery({
      // transaction_id, out_trade_no 二选一
      // transaction_id: '微信的订单号',
      out_trade_no: '商户内部订单号'
    });
  }

  async getPayParamsByPrepay() {
    const {app, ctx} = this;
    let result = await this.api.getPayParamsByPrepay({
      prepay_id: '预支付会话标识'
    });
    ctx.body = {
      result
    }
  }
}

module.exports = PayController;
