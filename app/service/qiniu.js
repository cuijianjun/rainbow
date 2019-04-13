const qiniu = require('qiniu');
const pump = require('mz-modules/pump');
const path = require('path');
const crypto = require('crypto');
const Service = require('egg').Service;
const fs = require('mz/fs');

class Qiniu extends Service {
  constructor(ctx) {
    super(ctx);
    this.baseImageUrl = this.app.config.baseImageUrl;
    this.accessKey = this.app.config.accessKey;
    this.secretKey = this.app.config.secretKey;
    this.bucket = this.app.config.bucket_name;
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    this.config = new qiniu.conf.Config();
    // 空间对应的机房
    this.config.zone = qiniu.zone.Zone_z1;
    this.qiniuFile = [];
  }

  async upload() {
    const { app, ctx } = this;
    const files = ctx.request.files;


    const options = {
      scope: this.bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);
    const formUploader = new qiniu.form_up.FormUploader(this.config);
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
    resData.map((value, index, array) => {
      resData[index].realUrl = this.baseImageUrl + resData[index].key;
    });
    return resData;
  }

  async destroy(key = []) { // 删除
    const { app, ctx } = this;
    const options = {
      scope: this.bucket,
    };
    const bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    const promises = key.map((value, index, array) => {
      return new Promise((resolve, reject) => {
        bucketManager.delete(this.bucket, value, function(err, respBody, respInfo) {
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
    const upload = await this.upload();
    const destroy = await this.destroy(key);
    return upload;
  }

  async getFileList(marker = '') { // 获取指定前缀的文件列表
    // @param options 列举操作的可选参数
    //  prefix    列举的文件前缀
    //  marker    上一次列举返回的位置标记，作为本次列举的起点信息
    //  limit     每次返回的最大列举文件数量
    //  delimiter 指定目录分隔符
    const bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    const options = {
      limit: 2,
      prefix: '',
      marker,
    };
    return new Promise((resolve, reject) => {
      bucketManager.listPrefix(this.bucket, options, function(err, respBody, respInfo) {
        if (err) {
          reject(err);
        }
        if (respInfo.statusCode == 200) {
          // 如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
          // 指定options里面的marker为这个值
          const nextMarker = respBody.marker ? respBody.marker : '';
          const commonPrefixes = respBody.commonPrefixes;
          const items = respBody.items;
          let imageData = {};
          const imageKey = items.map((value, index) => {
            return value.key;
          });
          imageData = {
            imageKey,
            nextMarker,
          };
          resolve(imageData);
        } else {
          reject({
            respInfo,
            respBody,
          });
        }
      });
    });
  }

  async getQiniuFile(mark = '') {
    const { app, ctx } = this;
    const tempList = await ctx.service.qiniu.getFileList(mark);
    this.qiniuFile = this.qiniuFile.concat(tempList.imageKey);
    mark = tempList.nextMarker;
    if (mark !== '') {
      await this.getQiniuFile(mark);
    }
  }
}

module.exports = Qiniu;

