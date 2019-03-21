const Service = require('egg').Service;

class Label extends Service {

  async list() {
    return this.ctx.model.Label.findAndCountAll();
  }

  async find(id = 0) {
    const label = await this.ctx.model.Label.findById(id);
    if (!label) {
      this.ctx.throw(404, 'label not found');
    }
    return label;
  }

  async create(label) {
    return this.ctx.model.Label.create(label);
  }

  async update({ id = 0, updates }) {
    const label = await this.ctx.model.Label.findById(id);
    if (!label) {
      this.ctx.throw(404, 'label not found');
    }
    return label.update(updates);
  }

  async del(id = 0) {
    const label = await this.ctx.model.Label.findById(id);
    if (!label) {
      this.ctx.throw(404, 'label not found');
    }
    return label.destroy();
  }
}

module.exports = Label;
