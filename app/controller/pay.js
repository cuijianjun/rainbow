const Controller = require('egg').Controller;
const tenpay = require('tenpay');

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
      pfx: require('fs').readFileSync('./apiclient_cert.p12'),
    };
    // const api = new tenpay(config);
    // 调试模式(传入第二个参数为true, 可在控制台输出数据)
    this.api = new tenpay(config, true);
  }

  async unifiedOrder() { // post 统一下单接口
    const {app, ctx} = this;
    let openId = app.controller.user.getOpenId(ctx.request.body.code);
    let result = await this.api.unifiedOrder({
      out_trade_no: ctx.helper.md5(+new Date()),
      body: '充值',
      total_fee: ctx.request.price, // todo
      openid: openId
    });
    console.log(result);
  }

  async notify() { // 回调通知
    const {app, ctx} = this;
    console.log(ctx.request);
  }

  async orderQuery() { // 查询订单
    let result = await this.api.orderQuery({
      // transaction_id, out_trade_no 二选一
      // transaction_id: '微信的订单号',
      out_trade_no: '商户内部订单号'
    });
  }
}

module.exports = PayController;
