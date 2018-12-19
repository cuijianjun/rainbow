'use strict';

// let response_formatter = (ctx) => {
//   //如果有返回数据，将返回数据添加到data中
//   if (ctx.body) {
//     ctx.body = {
//       code: 0,
//       message: 'success',
//       data: ctx.body
//     }
//   } else {
//     ctx.body = {
//       code: 0,
//       message: 'success'
//     }
//   }
// };

module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
      // 处理响应结果
      // 如果直接写入在 body 中，则不作处理
      // 如果写在 ctx.body 为空，则使用 state 作为响应
      ctx.body = ctx.body ? ctx.body : {
        code: ctx.state.code !== undefined ? ctx.state.code : 0,
        data: ctx.state.data !== undefined ? ctx.state.data : {}
      }
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = { error };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
    // response_formatter(ctx);
  };
};
