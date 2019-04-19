const { Controller } = require('egg');
class BaseController extends Controller {
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


  async sendTemplateMessage() {
    const {app, ctx} = this;
    // POST https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=ACCESS_TOKEN
    // let scene = ctx.params;
    // console.log(scene);
    let getAccessToken = await this.updateAccessToken();
    let access_token = getAccessToken.access_token;
    // ctx.status = 201;
    // ctx.body = await this.qrcode();
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
module.exports = BaseController;
