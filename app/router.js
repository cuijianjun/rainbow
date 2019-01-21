'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller, middleware} = app;
  const auth = middleware.auth();//校验用户token中间件
  // router.get('users', '/users', 'users.index');
  router.post('/login', 'user.login'); // 小程序授权
  // product_list
  router.post('ProductList', '/api/product_list/list', 'productlist.index');
  router.post('ProductList', '/api/product_list/create', auth, 'productlist.create');
  router.post('ProductList', '/api/product_list/update', auth, 'productlist.update');
  router.get('ProductList', '/api/product_list/delete/:id', auth, 'productlist.destroy');
};
