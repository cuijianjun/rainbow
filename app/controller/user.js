

const Controller = require('egg').Controller;
// const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');

class UserController extends Controller {

  async login() {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    const ctx = this.ctx;
    const app = this.app;
    let result = await this.getOpenId(ctx.request.body.code);
    let data = JSON.parse(result.data);
    if (result.status == 200) {
      let sessionKey = String(data.session_key);
      let openId = data.openid;
      if (!openId) {
        ctx.throw(500, '获取openId失败');
      }
      let userInfo = await ctx.service.user.check(openId);//判断是否新用户
      // 新用户注册
      if (userInfo === false) {
        let body = ctx.request.body;
        userInfo = await ctx.service.user.wxRegister({...body, openid: openId});
      }
      ctx.body = {userInfo};
    } else {
      ctx.throw(500, '获取openId失败');
    }
  }

  async update() { // post
    const ctx = this.ctx;
    ctx.status = 201;
    ctx.body = await ctx.service.user.update({id, updates: ctx.request.body});
  }

  async getOpenId(code) {
    const ctx = this.ctx;
    const app = this.app;
    ctx.validate({
      code: {
        type: 'string',
        required: true,
      },
    }, {
      code
    });
    return await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      data: {
        js_code: code,
        appid: app.config.AppID,
        secret: app.config.AppSecret,
        grant_type: 'authorization_code'
      }
    });
  }

  /**
   * 用户列表
   * offset   第几页
   * limit    一页多少条记录
   */
  async adminUserList() {
    let info = {};
    // 校验数据的正确性
    // if (this.ctx.request.body.nick_name) {
    //   info.nick_name = this.ctx.request.body.nick_name
    // }
    //
    // if (!this.ctx.request.body.offset) {
    //   info.offset = 0
    // } else {
    //   info.offset = this.ctx.request.body.offset
    // }
    //
    // if (!this.ctx.request.body.limit) {
    //   info.limit = 10
    // } else {
    //   info.limit = this.ctx.request.body.limit
    // }

    // this.ctx.body = await this.ctx.service.adminUser.adminUserList(info);
  }
}

module.exports = UserController;
