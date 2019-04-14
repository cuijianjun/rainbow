/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = middleware.auth();// 校验用户token中间件
  const xmlparse = app.middleware.xmlparse();
  router.post('/login', auth, 'user.login'); // 小程序授权
  router.post('/api/user/update', auth, 'user.update'); // 小程序用户信息更新
  // banner图 + 类别
  router.get('Banner', '/api/banner/get', 'banner.index');
  router.post('Banner', '/api/banner/create', 'banner.create');
  router.post('Banner', '/api/banner/update', 'banner.update');
  router.get('Banner', '/api/banner/delete/:id', 'banner.destroy');
  // 收藏
  router.post('Collect', '/api/collect/collect', 'collect.collect');
  router.get('Collect', '/api/collect/list/:user_id', 'collect.list');
  // 热搜
  router.get('HotSearch', '/api/hot_search/list', 'hotsearch.index');
  router.post('HotSearch', '/api/hot_search/create', 'hotsearch.create');
  router.post('HotSearch', '/api/hot_search/update', 'hotsearch.update');
  router.get('HotSearch', '/api/hot_search/delete/:id', 'hotsearch.destroy');


  // 图片上传接口 upload
  router.post('/api/image/upload', 'qiniu.upload');
  router.get('/api/image/delete/:imageKey', 'qiniu.destroy');

  // product_list
  router.post('ProductList', '/api/product_list/list', 'productlist.index'); // ok
  router.get('ProductList', '/api/product_list/detail/:product_id/:user_id', 'productlist.show'); // ok
  router.post('ProductList', '/api/product_list/create', auth, 'productlist.create');// ok
  router.post('ProductList', '/api/product_list/update', auth, 'productlist.update');
  router.get('ProductList', '/api/product_list/delete/:id', auth, 'productlist.destroy');
  router.get('ProductList', '/api/product_list/updateTime/:id', auth, 'productlist.updateTime');

  // order
  router.post('Order', '/api/order/order', 'order.placeOrder'); // 生成订单
  router.get('Order', '/api/order/getOrderList/:user_id', 'order.list'); // 展示订单列表
  router.get('Order', '/api/order/getOrderDetail/:order_id', 'order.index'); // 显示订单详情
  router.get('Order', '/api/order/delete/:order_id', 'order.del'); // 删除订单
  router.post('Order', '/api/order/update', 'order.update'); // 更新订单
  // 微信支付
  router.post('Pay', '/api/pay/unifiedOrder', 'pay.unifiedOrder'); // 统一下单接口
  router.post('Pay', '/api/pay/notify', xmlparse, 'pay.notify'); // 微信通知
};
