'use strict';

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
    console.log(user);
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

  async find(openid) {
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

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  async update({id, updates}) {
    const user = await this.ctx.model.User.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.update(updates);
  }

  async del(id) {
    const user = await this.ctx.model.User.findById(id);
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
    const user = await this.ctx.model.User.findOne(
      {
        where: {user_id: user_id}
      }
    );
    if (!user) {
      this.ctx.throw(404, '用户不存在')
    }
    return user;
  }

  /**
   * 设置用户信息
   */
  async setUserInfo(user_id, user) {
    await this.ctx.model.User.update(user, {where: {user_id: user_id}});
  }
}

module.exports = User;
