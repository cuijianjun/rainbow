const Controller = require('egg').Controller;

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
    let data = await ctx.helper.decryptData(encryptedData , iv, session_key, this.AppID)// todo
    console.log('解密后 data: ', data)
    ctx.body = data;
  }

  async getUnlimited() {
    const {app, ctx} = this;
    let scene = ctx.params;
    console.log(scene);
    let getAccessToken = await this.updateAccessToken();
    // let checkToken = await this.checkToken(getAccessToken);
    let access_token = getAccessToken.access_token;
    let stream = await ctx.curl(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`, {
      method: 'POST',
      encoding: 'base64',
      data: {
        scene: scene
      }
    });
    // 获取图片
    const imgBuffer = Buffer.from(stream.data, 'binary');
    console.log(imgBuffer);
  }

  async checkToken(data) {
    if (this.isValidAccessToken(data)) {
      return data;
    } else {
      return this.updateAccessToken();
    }
  }

  async getAccessToken() { // 查询数据库 post
    const {app, ctx} = this;
    this.user_id = ctx.request.body.user_id;
    let userInfo = await ctx.service.user.find(this.user_id);
    return JSON.parse(userInfo.access_token);
  }

  async isValidAccessToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false;
    }
    let access_token = data.access_token;
    let expires_in = data.expires_in;
    console.log('token有效时间expires_in', expires_in);
    let now = (new Date().getTime())

    if (now < expires_in) {
      console.log('token有效');
      return true;
    } else {
      return false;
    }
  }

  async updateAccessToken() {
    const {app, ctx} = this;
    let result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.AppID}&secret=${this.AppSecret}`, {dataType: 'json'});
    let data = JSON.stringify(result.data);
    let query = {
      id: this.user_id,
      access_token: data
    };
    return result.data;
    // return await ctx.service.user.update(query);
  }
}


module.exports = CommonWeixinController;
