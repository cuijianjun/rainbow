const request = require('request-promise');
const fs = require('fs');
const Controller = require('../core/baseController');

class CommonWeixinController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.AppID = this.app.config.AppID;
    this.AppSecret = this.app.config.AppSecret;
    this.idRule = {
      user_id: {
        type: 'int',
        required: true,
      }
    };

  }

  async getPhoneNumber() { // post
    const {app, ctx} = this;
    const {encryptedData, iv, code} = ctx.request.body;
    let result = await ctx.service.user.getOpenId(code);
    const {openid, session_key} = JSON.parse(result.data);
    let data = await ctx.helper.decryptData(encryptedData, iv, session_key, this.AppID)// todo
    console.log('解密后 data: ', data);
    ctx.body = data;
  }

  async getUnlimited() {
    const {app, ctx} = this;
    let scene = ctx.params;
    console.log(scene);
    let getAccessToken = await this.updateAccessToken();
    // let checkToken = await this.checkToken(getAccessToken);
    let access_token = getAccessToken.access_token;
    ctx.status = 201;
    ctx.body = await this.qrcode();
  }

}


module.exports = CommonWeixinController;
