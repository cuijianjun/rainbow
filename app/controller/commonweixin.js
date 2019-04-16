const Controller = require('egg').Controller;
const request = require('request-promise');
const fs = require('fs');
const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
  AppId: '********',
  SecretId: '***************',
  SecretKey: '**************',
});


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
    ctx.status = 201;
    ctx.body = await this.qrcode();
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

  //获取二维码
  async qrcode() {
    const {app, ctx} = this;
    const {page, scene} = ctx.request.body;
    //获取access_token
    let access_token = await this.updateAccessToken();
    let qrcodeurl = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + access_token;
    let options = {
      method: 'POST',
      uri: qrcodeurl,
      encoding: 'base64',
      body: {
        "path": page,//带参数的path
        "width": 280,
        "is_hyaline": false,
        scene
      },
      json: true
    }
    return await this.getBase(options);
  }
  async getBase(options) {
    return new Promise((resolve, reject) => {
      request(options)
        .then(function (body) {
          let base64Img = body.toString('base64');  // base64图片编码字符串
          console.log(base64Img);
          resolve(base64Img);
          let dataBuffer = new Buffer(base64Img, 'base64');

        })
        .catch(function (err) {
          console.log(err)
          reject(err);
        });
    })

  }

}


module.exports = CommonWeixinController;
