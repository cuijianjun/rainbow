//微信金额支付
money_pay(order) {
  var that = this;
  api.getRequest('mp/qmkt/pay/prePay', {
    output: 'json',//数据格式
    coins: order.coins,//你们不用，这是我们公司的虚拟货币
    express_price: order.express_price,//价格
    pay_data: JSON.stringify(order.pay_data),//订单详情
    pay_fee: Number(order.pay_fee) + Number(order.express_price),//你们不需要，这个是我们虚拟货币跟现金支付需要的字段
    pay_type: order.pay_type,//支付类型，我们公司，有书豆支付（icon_pay），现金支付
    total_fee: Number(order.total_fee) + Number(order.express_price)//你们不需要
  })
    .then((infoResp) => {
      console.log(infoResp)
      if (infoResp.code == 1) {
        that.setData({
          trade_no: infoResp.data.trade_no
        })
        wx.requestPayment({
          timeStamp: String(infoResp.data.timeStamp),
          nonceStr: infoResp.data.nonceStr,
          package: infoResp.data.package,
          signType: 'MD5',
          paySign: infoResp.data.paySign,
          success(res) {
            that.setData({
              is_buy: true
            })
            that.buy_success();
          },
          fail(res) {
            that.cancel_order();
            // wx.showToast({
            //   title: '订单已取消',
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        })
        wx.hideLoading();
      } else {
        wx.showModal({
          title: '错误信息',
          content: infoResp.msg,
          showCancel: false,
        })
      }
    });
},

wx.requestPayment({
  timeStamp: String(infoResp.data.timeStamp),
  nonceStr: infoResp.data.nonceStr,
  package: infoResp.data.package,
  signType: 'MD5',
  paySign: infoResp.data.paySign,
  success(res) {
  }
