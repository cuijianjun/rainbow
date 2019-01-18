'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('users', '/users', 'users.index');
  router.get('/login', 'user.login'); // 登录
  // product_list
  router.post('ProductList', '/api/product_list/list', 'productlist.index');
  router.post('ProductList', '/api/product_list/create', 'productlist.create');
  router.post('ProductList', '/api/product_list/update', 'productlist.update');
  router.get('ProductList', '/api/product_list/delete/:id', 'productlist.destroy');
};
