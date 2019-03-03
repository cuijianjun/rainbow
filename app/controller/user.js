'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');

class UserController extends Controller {
  async login() {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    const ctx = this.ctx;
    const app = this.app;
    let code = ctx.request.body.code;
    ctx.validate({
      code: {
        type: 'string',
        required: true,
      },
    }, {
      code
    });
    const result = await ctx.curl('https://api.weixin.qq.com/sns/jscode2session', {
      data: {
        js_code: code,
        appid: app.config.AppID,
        secret: app.config.AppSecret,
        grant_type: 'authorization_code'
      }
    });
    //生成当前服务器时间
    let data = JSON.parse(result.data);
    if (result.status == 200) {
      let sessionKey = String(data.session_key);
      let openId = data.openid;
      if (!openId) {
        ctx.throw(500, '获取openId失败');
      }
      let userInfo = await ctx.service.user.find(openId);//判断是否新用户
      // 新用户注册
      if (userInfo === false) {
        let body = ctx.request.body;
        userInfo = await ctx.service.user.wxRegister({...body,openid: openId });
      }
      // 生成token
      const token = jwt.sign({user_id: userInfo.id}, app.config.jwtSecret, {expiresIn: '7d'});
      ctx.body = {token: `${token}`, userInfo};
      ctx.set('authorization', token);
    } else {
      ctx.throw(500, '获取openId失败');
    }
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
