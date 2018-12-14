'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('users', '/users', 'users.index');
  router.get('product_list', '/users', 'users.index');
};
