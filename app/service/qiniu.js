'use strict';

const qiniu = require('qiniu');
const pump = require('mz-modules/pump');
const path = require('path');
const crypto = require('crypto');
const Service = require('egg').Service;
const fs = require('mz/fs');

class Qiniu extends Service {
  constructor(ctx) {
    super(ctx);
  }

  // 获取七牛云信息
  async upload() {
    const { app, ctx } = this;
    const files = ctx.request.files;
    const accessKey = app.config.accessKey;
    const secretKey = app.config.secretKey;
    const bucket = app.config.bucket_name;
    const options = {
      scope: bucket,
    };
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    // 上传到七牛后保存的文件名
    const config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z1;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const promises = files.map(file => {
      const filename = file.filepath.toLowerCase();
      const info = filename.split('.');
      const name = crypto.createHash('md5').update(info[0]).digest('hex');
      const key = `${name}.${info[info.length - 1]}`;
      return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, key, file.filepath, putExtra, function(respErr, respBody, respInfo) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            resolve(respBody);
          } else {
            reject(respBody);
          }
        });
      });
    });
    const resData = await Promise.all(promises);
    const imageKey = [];
    resData.map((value, index, array) => {
      imageKey.push(value.key);
    });
    return imageKey.length === 1 ? imageKey[0] : imageKey;
  }

  async destroy(key = []) { // 删除
    const { app, ctx } = this;
    const accessKey = app.config.accessKey;
    const secretKey = app.config.secretKey;
    const bucket = app.config.bucket_name;
    const options = {
      scope: bucket,
    };
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const config = new qiniu.conf.Config();
    // config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z1;
    const bucketManager = new qiniu.rs.BucketManager(mac, config);

    const promises = key.map((value, index, array) => {
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
    return await Promise.all(promises);
  }

  async update(key = []) {
    let upload = await this.upload();
    let destroy = await this.destroy(key);
    return upload;
  }
}

module.exports = Qiniu;

