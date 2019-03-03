'use strict';

const qiniu = require('qiniu');
const pump = require('mz-modules/pump');
const path = require('path');
const crypto = require('crypto');
const Controller = require('egg').Controller;
const fs = require('mz/fs');

class QiniuController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      user_id: {
        type: 'int',
        required: true,
      }
    };
    this.productIdRule = {
      product_id: {
        type: 'int',
        required: true,
      }
    };
  }
  // 获取七牛云信息
  async upload() {
    const {app, ctx} = this;
    const files = ctx.request.files;
    const accessKey = app.config.accessKey;
    const secretKey = app.config.secretKey;
    const bucket = app.config.bucket_name;
    const baseImageUrl = app.config.baseImageUrl;
    let options = {
      scope: bucket,
    };
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    //上传到七牛后保存的文件名
    let config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z1;
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    let promises = files.map(file => {
      const filename = file.filename.toLowerCase();
      let info = filename.split('.');
      let name = crypto.createHash('md5').update(info[0]).digest('hex');
      const key = `${name}.${info[info.length - 1]}`;
      return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, key, file.filepath, putExtra, function (respErr, respBody, respInfo) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            resolve(respBody);
          } else {
            reject(respBody);
            console.log(respInfo.statusCode);
            console.log(respBody);
          }
        })
      });
    });
    let resData = await Promise.all(promises);
    let imageUrl = [];
    resData.map((value, index, array) => {
      resData[index].key = baseImageUrl + resData[index].key;
      imageUrl.push(resData[index].key);
    });
    // 入库
    let user_id = ctx.helper.parseInt(ctx.request.body.user_id);
    ctx.validate(this.createRule, {user_id});
    let count = await ctx.model.ProductList.count();
    console.log(ctx.service);
    const product = await ctx.service.qiniu.create({url:JSON.stringify(imageUrl),product_id: count +1, user_id,});
    ctx.status = 201;
    ctx.body = resData;
  }

  async index() { // get -- 获取
    const ctx = this.ctx;
    const product_id = ctx.helper.parseInt(ctx.params.product_id);
    if (!product_id) {
      ctx.status = 404;
      ctx.body = 'product_id不能为空';
    }
    ctx.validate(this.productIdRule, {
      product_id: ctx.helper.parseInt(product_id),
    });
    ctx.body = await ctx.service.qiniu.list(product_id);
  }

  async destroy() { // 删除 -- get
    const ctx = this.ctx;
    const product_id = ctx.helper.parseInt(ctx.params.product_id);
    if (!product_id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.productIdRule, {
      product_id: ctx.helper.parseInt(product_id),
    });

    await ctx.service.qiniu.del(product_id);
    ctx.status = 200;
  }
}

module.exports = QiniuController;

