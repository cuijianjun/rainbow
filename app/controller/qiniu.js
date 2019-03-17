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
  }

  async upload() {
    const {app, ctx} = this;
    const upload = await ctx.service.qiniu.upload();
    ctx.status = 201;
    ctx.body = upload;
  }

  async destroy() { // 删除 -- get
    const {app, ctx} = this;
    const key = ctx.params.imageKey;
    const del = await ctx.service.qiniu.destroy([key]);
    ctx.status = 201;
    ctx.body = {
      message: 'delete success'
    };
  }
}

module.exports = QiniuController;

