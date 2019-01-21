'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');

class UserController extends Controller {
  async login() {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    const ctx = this.ctx;
    let code = ctx.query.code;
    const result = await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      data: {
        js_code: code,
        appid: this.app.config.AppID,
        secret: this.app.config.AppSecret,
        grant_type: 'authorization_code'
      }
    });
    let data = JSON.parse(result.data);
    if (result.status == 200) {
      let sessionKey = String(data.session_key);
      let openId = data.openid;
      let sessionData = {
        sessionKey,
        openId
      };
      //自定义的加密，作为session_id
      let skey = crypto.createHash('sha1').update(JSON.stringify(sessionData)).digest('hex');
      // 存入session
      ctx.session[skey] = JSON.stringify(sessionData);
      // 入库 TODO
      //返回给客户端
      ctx.cookies.set('skey', skey, {
        maxAge: 24 * 3600 * 1000
      });
      ctx.body = {skey};
    } else {
      ctx.throw(500, '获取openId失败');
    }
  }

}

module.exports = UserController;
