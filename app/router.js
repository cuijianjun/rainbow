'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('users', '/users', 'users.index');

  // product_list
  router.get('ProductList', '/list', 'productlist.index');
  router.post('ProductList', '/create', 'productlist.create');
};
