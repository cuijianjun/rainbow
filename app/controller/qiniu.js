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
      scope: bucket
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
          }
        })
      });
    });
    let resData = await Promise.all(promises);

    let imageKey = [];
    let imageUrl = [];
    resData.map((value, index, array) => {
      imageKey.push(resData[index].key);
      resData[index].key = baseImageUrl + resData[index].key;
      imageUrl.push(resData[index].key);
    });
    let count = await ctx.model.ProductList.count();
    // 入库
    const product = await ctx.service.qiniu.create({url: JSON.stringify(imageKey), product_id: count + 1});
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
    const {app, ctx} = this;
    const accessKey = app.config.accessKey;
    const secretKey = app.config.secretKey;
    const bucket = app.config.bucket_name;
    const baseImageUrl = app.config.baseImageUrl;
    let options = {
      scope: bucket
    };
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z1;
    let bucketManager = new qiniu.rs.BucketManager(mac, config);

    const product_id = ctx.helper.parseInt(ctx.params.product_id);
    if (!product_id) {
      ctx.status = 404;
      ctx.body = 'id不能为空';
    }
    ctx.validate(this.productIdRule, {
      product_id: ctx.helper.parseInt(product_id),
    });

    let product = await ctx.service.qiniu.del(product_id);
    const key = JSON.parse(product.dataValues.url);
    console.log(key);
    if (!key) {
      ctx.status = 200;
      ctx.body = '本产品没有图片';
    }

    let promises = key.map((value, index, array) => {
      return new Promise((resolve, reject) => {
        bucketManager.delete(bucket, value, function(err, respBody, respInfo) {
          if (err) {
            reject(err);
            throw err;
          } else {
            resolve(respInfo);
          }
        });
      });
    });
    let resData = await Promise.all(promises);
    console.log(resData);
    ctx.status = 200;
  }
}

module.exports = QiniuController;

