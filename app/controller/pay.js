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
    const openid = await this.getOpenId(user_id);
    const out_trade_no = await this.getOutTradeNo(order_id);
    const result = await this.api.unifiedOrder({
      out_trade_no,
      body: '充值',
      total_fee: total_price * 100, // todo
      openid,
    });
    const data = this.api.getPayParamsByPrepay({
      prepay_id: result.prepay_id,
    });
    ctx.status = 200;
    ctx.body = data;
  }

  async getOpenId(user_id) {
    const {app, ctx} = this;
    const user = await ctx.service.order.getUser(user_id);
    const openid = user.dataValues.openid;
    if (!openid) {
      ctx.status = 404;
      ctx.body = {
        message: '对不起, 请授权登录',
      };
    }
    return openid;
  }

  async getOutTradeNo(order_id) {
    const {app, ctx} = this;
    const product = await ctx.service.order.find(order_id);
    let order_no = product.dataValues.order_no
    if (!order_no) {
      ctx.status = 404;
      ctx.body = {
        message: '对不起, 请确认商品准确性',
      };
    }
    return order_no;
  }

  async notify() { // 回调通知
    const {app, ctx} = this;
    let data = '';
    const json = {};
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', function (chunk) {
      data += chunk;
    });
    const _self = this;
    const return_data = await new Promise(function (resolve) {
      ctx.req.on('end', function () {
        xml2js(data, {explicitArray: false}, async function (err, json) {
          // console.log(json);//这里的json便是xml转为json的内容
          const return_data = json.xml;
          resolve(return_data);
        });
      });
    });
    ctx.status = 200;
    console.log(await _self.handleOutput(return_data));
    ctx.body = await _self.handleOutput(return_data);
  }

  async handleOutput(return_data) {
    const {app, ctx} = this;
    let output = '';
    if (return_data.return_code == 'SUCCESS') {
      const order = await ctx.service.order.findByOutTradeNo(return_data.out_trade_no);
      const reply = {
        return_code: 'SUCCESS',
        return_msg: 'OK',
      };
      if (order.dataValues.total_price * 100 === ctx.helper.parseInt(return_data.total_fee)) {
        if (order.dataValues.status === 1) {
          let query = {
            order_no: 201904140115723,
            updates: {status: 2}
          };
          await ctx.service.order.update(query);
          output = '<xml><return_code><![CDATA[' + reply.return_code + ']]></return_code><return_msg><![CDATA[' + reply.return_msg + ']]></return_msg></xml>';
          console.log(output, 'reply');
          return output;
        }
        return;
      }
      const reply_error = {
        return_code: 'FAIL',
        return_msg: 'FAIL',
      };
      output = '<xml><return_code><![CDATA[' + reply_error.return_code + ']]></return_code><return_msg><![CDATA[' + reply_error.return_msg + ']]></return_msg></xml>';
      console.log(output, 'reply_error');
    } else {
      const reply_error = {
        return_code: 'FAIL',
        return_msg: 'FAIL',
      };
      output = '<xml><return_code><![CDATA[' + reply_error.return_code + ']]></return_code><return_msg><![CDATA[' + reply_error.return_msg + ']]></return_msg></xml>';
    }
    return output;
  }

  async orderQuery() { // 查询订单
    const result = await this.api.orderQuery({
      // transaction_id, out_trade_no 二选一
      // transaction_id: '微信的订单号',
      out_trade_no: '商户内部订单号',
    });
  }

  async getPayParamsByPrepay() {
    const {app, ctx} = this;
    const result = await this.api.getPayParamsByPrepay({
      prepay_id: '预支付会话标识',
    });
    ctx.body = {
      result,
    };
  }
}

module.exports = PayController;
