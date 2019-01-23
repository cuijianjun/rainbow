'use strict';

const qiniu = require('qiniu');
const pump = require('mz-modules/pump');
const path = require('path');
const crypto = require('crypto');
const Controller = require('egg').Controller;
const fs = require('mz/fs');

class QiniuController extends Controller {
  // 获取七牛云信息
  async upload() {
    const {app, ctx} = this;
    const files = ctx.request.files;
    const accessKey = app.config.accessKey;
    const secretKey = app.config.secretKey;
    const bucket = app.config.bucket_name;
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
    try {
      let promises = files.map(file => {
        const filename = file.filename.toLowerCase();
        let info = filename.split('.');
        let nameText = info[0] + Date.now();
        let name = crypto.createHash('md5').update(nameText).digest('hex');
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
      let result = await Promise.all(promises);
      ctx.body = result;
    } finally {
      // delete those request tmp files
      // ctx.body = res;
      await ctx.cleanupRequestFiles();
    }

  }
}

module.exports = QiniuController;

