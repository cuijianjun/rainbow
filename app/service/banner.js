const Service = require('egg').Service;

class Banner extends Service {

  async list() {
    return this.ctx.model.Banner.findAndCountAll();
  }

  async find(id = 0) {
    const banner = await this.ctx.model.Banner.findOne(id);
    if (!banner) {
      this.ctx.throw(404, 'banner not found');
    }
    return banner;
  }

  async create(banner) {
    return this.ctx.model.Banner.create(banner);
  }

  async update({ id = 0, updates }) {
    const banner = await this.ctx.model.Banner.findOne(id);
    if (!banner) {
      this.ctx.throw(404, 'banner not found');
    }
    return banner.update(updates);
  }

  async del(id = 0) {
    const banner = await this.ctx.model.Banner.findOne(id);
    if (!banner) {
      this.ctx.throw(404, 'banner not found');
    }
    return banner.destroy();
  }
}

module.exports = Banner;
