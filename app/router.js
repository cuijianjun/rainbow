'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller, middleware} = app;
  const auth = middleware.auth();// 校验用户token中间件
  router.post('/login', auth, 'user.login'); // 小程序授权
  router.post('/api/user/update', auth, 'user.update'); // 小程序用户信息更新
  // banner图 + 类别
  router.get('Banner', '/api/banner/get', 'banner.index');
  router.post('Banner', '/api/banner/create', 'banner.create');
  router.post('Banner', '/api/banner/update', 'banner.update');
  router.get('Banner', '/api/banner/delete/:id', 'banner.destroy');
  // 收藏
  router.post('Collect', '/api/collect/collect', 'collect.collect');
  // 热搜
  router.get('HotSearch', '/api/hot_search/list', 'hotsearch.index');
  router.post('HotSearch', '/api/hot_search/create', 'hotsearch.create');
  router.post('HotSearch', '/api/hot_search/update', 'hotsearch.update');
  router.get('HotSearch', '/api/hot_search/delete/:id', 'hotsearch.destroy');


  // 图片上传接口
  //   router.post('/api/image/upload', 'qiniu.upload');
  //   router.get('/api/image/list/:product_id', 'qiniu.index');
  //   router.get('/api/image/delete/:product_id', 'qiniu.destroy');
  // product_list
  router.post('ProductList', '/api/product_list/list', 'productlist.index');
  router.get('ProductList', '/api/product_list/detail/:product_id/:user_id', 'productlist.show');
  router.post('ProductList', '/api/product_list/create', 'productlist.create');
  router.post('ProductList', '/api/product_list/update', auth, 'productlist.update');
  router.get('ProductList', '/api/product_list/delete/:id', auth, 'productlist.destroy');
};
