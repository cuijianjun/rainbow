

const Service = require('egg').Service;
const moment = require('moment');

class ProductList extends Service {
  constructor(ctx) {
    super(ctx);
    this.type = ctx.app.config.type;
    this.Sequelize = ctx.app.Sequelize;
    this.Op = ctx.app.Sequelize.Op;
  }

  async list({ page = 0, limit = 10, user_id, labelCode, searchQuery }) {
    page = page >= 1 ? page - 1 : 0;
    const offset = page * limit;
    const options = {
      offset,
      limit,
      include: [
        {
          model: this.ctx.model.Label,
          where: {
            code: this.Sequelize.col('product_list.labelCode'),
          },
        },
        {
          model: this.ctx.model.User,
          where: {
            id: this.Sequelize.col('product_list.user_id'),
          },
        },
      ],
      order: [['updated_at', 'desc'], ['id', 'desc']],
    };
    if (user_id) {
      options.where = {
        user_id,
      };
    }
    if (labelCode) {
      options.where = {
        labelCode,
      };
    }
    if (labelCode && user_id) {
      options.where = {
        user_id,
        labelCode,
      };
    }
    if (searchQuery) {
      options.where = {
        [this.Op.or]: [
          { description: { [this.Op.like]: `%${searchQuery}%` } },
          { title: { [this.Op.like]: `%${searchQuery}%` } },
        ],
      };
    }
    return this.ctx.model.ProductList.findAndCountAll(options);
  }

  async find(id = 0) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product;
  }

  async create(product) {
    return this.ctx.model.ProductList.create(product);
  }

  async update({ id = 0, updates }) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.update(updates);
  }

  async updateTime({ id = 0 }) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    await this.ctx.model.ProductList.update({
      updatedAt: this.now,
    },
    {
      where: {
        id,
      },
    });
    return {
      code: 200,
      message: 'update success',
    };
  }
  async del(id = 0) {
    const product = await this.ctx.model.ProductList.findById(id);
    if (!product) {
      this.ctx.throw(404, 'product not found');
    }
    return product.destroy();
  }
}

module.exports = ProductList;
