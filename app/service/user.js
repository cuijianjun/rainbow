

const Service = require('egg').Service;

class User extends Service {
  /**
   * 新用户注册
   *
   * @param user  用户信息对象
   *
   * @return {Promise<*>}
   */
  async wxRegister(user) {
    const userInfo = await this.ctx.model.User.create(user);
    return userInfo.dataValues;
  }

  async list({offset = 0, limit = 10}) {
    return this.ctx.model.User.findAndCountAll({
      offset,
      limit,
      order: [['created_at', 'desc'], ['id', 'desc']],
    });
  }

  async check(openid) {
    const user = await this.ctx.model.User.findOne(
      {
        where: {openid: openid}
      }
    );
    if (user && user.dataValues.openid) { // todo
      return user;
    }
    return false;
  }


  async find(user_id) {
    const user = await this.ctx.model.User.findOne(
      {
        where: {id: user_id}
      }
    );
    if (user && user.dataValues.user_id) { // todo
      return user;
    }
    return false;
  }

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  async update({id = 0, updates}) {
    const user = await this.ctx.model.User.findOne({id});
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id = 0) {
    const user = await this.ctx.model.User.findOne({id});
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }

  /**
   * 用户信息
   *
   * @param user_id
   *
   * @return {Promise<*>}
   */
  async userInfo(user_id) {
    let options = null;
    if (user_id) {
      options.where = {
        user_id,
      };
    }
    const user = await this.ctx.model.User.findOne(options);
    if (!user) {
      this.ctx.throw(404, '用户不存在')
    }
    return user;
  }

  /**
   * 设置用户信息
   */
  async setUserInfo(user_id, user) {
    let options = {...user};
    if (user_id) {
      options.where = {
        user_id,
      };
    }
    await this.ctx.model.User.update(options);
  }
}

module.exports = User;
