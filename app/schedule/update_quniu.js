const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '86400s', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { app, ctx } = this;
    const product_list = await ctx.model.ProductList.findAll();
    const banner_list = await ctx.model.Banner.findAll();
    const qiniu_temp = await ctx.service.qiniu.getQiniuFile();
    const qiniuFile = ctx.service.qiniu.qiniuFile;
    const productPayLoad = {
      filed: 'productImage',
      data: product_list,
    };
    const bannerPayLoad = {
      filed: 'imageUrl',
      data: banner_list,
    };
    const image = [].concat(this.getImage(productPayLoad), this.getImage(bannerPayLoad));
    console.log(qiniuFile);
    console.log(image);
    const diffImage = ctx.helper.getArrDifference(qiniuFile, image);
    const del = await ctx.service.qiniu.destroy(diffImage);
    ctx.logger.info('status: %j', del);
  }

  /**
   *
   * @param data find mysql one or one+
   * @return Array
   */
  getImage({ filed, data }) {
    const { app, ctx } = this;
    if (!data) {
      return [];
    }
    if ((ctx.helper.isArray(data) && data.length === 0)) {
      return [];
    }
    const image = [];
    if (ctx.helper.isArray(data)) {
      const image = data.map((value, index, Array) => {
        if (!value.dataValues[filed]) {
          return;
        }
        return value.dataValues[filed];
      });
      return image;
    }
  }
}

module.exports = UpdateCache;
