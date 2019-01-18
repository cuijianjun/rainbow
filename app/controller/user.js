'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');

class UserController extends Controller {
  async login() {``
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    const ctx = this.ctx;
    let code = ctx.query.code;
    let cookies = ctx.cookies;
    //生成当前服务器时间
    let curTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const result = await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      data: {
        js_code: code,
        appid: this.app.config.AppID,
        secret: this.app.config.AppSecret,
        grant_type: 'authorization_code'
      }
    });
    // 无论什么结果  直接返回
    let data = result.data;
    ctx.body = result.data;


    if (result.status == 200) {
      let sessionKey = String(data.session_key);
      let openId = data.openid;
      //自定义的加密，作为session_id
      let skey = crypto.createHash('sha1').update(sessionKey).digest('hex');
      let data = {
        lastTime:curTime,
        curTime:curTime,
        cookies:cookies
      };
      let sessionData = {
        expires:60000,
        data: JSON.stringify(data)
      };
     // 存入session
      ctx.session[skey] = sessionData;
      // 入库 TODO
      //返回给客户端
      ctx.body = sessionData;
    } else {
      ctx.throw(500, '获取openId失败');
    }
  }

}

module.exports = UserController;
