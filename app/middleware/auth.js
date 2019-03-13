'use strict';
/**
 * TOKEN 校验中间件
 * @author cuijianjun
 *
 * @param next
 *
 * @modified by cuijianjun on 15:01 2018/7/19
 * @return {Promise<void>}
 */

'use strict';

module.exports = () => {
  return async function(ctx, next) {
    const token = ctx.header.authorization;
    const timeStamp = ctx.header.timeStamp;
    if (!token) {
      ctx.status = 401;
      ctx.body = 'token不能为空';
      return;
    }
    // 验证token是否过期
    try {
      let key = ctx.app.config.jwtSecret;
      let method = ctx.request.method;
      let payLoad = '';
      if (method === 'GET') {
        payLoad = ctx.params;
      } else if(method === 'GET') {
        payLoad = ctx.request;
      }
      let signBuffer = `${key}${JSON.stringify(payLoad)}${timeStamp}`;
      const md5 = ctx.helper.md5(signBuffer);
      if (md5 !== token) {
        ctx.status = 401;
        ctx.body = 'token无效';
        return;
      }
    } catch (err) {
      ctx.status = 401;
      ctx.body = 'token无效';
      return;
    }
    await next();
  };
};

// const token = ctx.header.authorization;
// if (!token) {
//   ctx.status = 401;
//   ctx.body = 'token不能为空';
//   return;
// }
// // 验证token是否过期
// try {
//   const userInfo = jwt.verify(token, ctx.app.config.jwtSecret);
//   const exp = userInfo.exp; // 过期时间
//   const now = parseInt(new Date().getTime() / 1000);
//   // 有效期小于一小时的重新赋值token
//   const isOver = exp - now < 60 * 60;
//   if (isOver) {
//     const token = jwt.sign({ user_id: userInfo.user_id }, ctx.app.config.jwtSecret, { expiresIn: '7d' });
//     ctx.set('authorization', token);
//   }
// } catch (err) {
//   ctx.status = 401;
//   // token过期
//   if (err.name === 'TokenExpiredError') {
//     ctx.body = 'token过期';
//   } else if (err.name === 'JsonWebTokenError') {
//     ctx.body = 'token无效';
//   }
//   return;
// }
// await next();
