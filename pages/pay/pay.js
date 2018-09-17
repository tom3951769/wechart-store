// pages/pay/pay.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    json: null,
    items: [{
        id: '0',
        nodeName: '微信支付',
        navigateUrl: '',
        iconurl: '/pages/images/wechartpayicon.png',
        isSelected: false
      },
      {
        id: '1',
        nodeName: '支付宝支付',
        navigateUrl: '',
        iconurl: '/pages/images/zhifubaoicon.png',
        isSelected: false
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.json != null) {
        var json = JSON.parse(options.json)
        this.setData({
          json: json
        })
      }
    }
  },
  onPay(e) {
    var that = this
    if (that.data.items[0].isSelected) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/order_pay_submit',
        header: {
          s: app.globalData.userInfo.session,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          order_id: that.data.json.order_id
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success(e) {
                if (e.requestPayment == 'ok') {
                  wx.navigateTo({
                    url: 'pages/orderinfo/orderinfo?order_id=' + that.data.json.order_id,
                  })
                } else if (e.requestPayment == 'cancel') {
                  wx.showModal({
                    title: '提示',
                    content: '支付失败,用户取消订单',
                  })
                  console.log(res)
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '支付失败',
                  })
                  console.log(res)
                }
              },
              fail(e) {
                console.log(res)
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '目前仅支持微信支付',
      })
    }
  },
  onSelected(e) {
    var id = e.currentTarget.dataset.item.id
    var index = parseInt(id)
    var isSelected = e.currentTarget.dataset.item.isSelected
    for (var i in this.data.items) {
      var item = this.data.items[i]
      if (item.id == id) {
        if (isSelected) {
          this.data.items[index].isSelected = false
        } else {
          this.data.items[index].isSelected = true
        }
      } else {
        this.data.items[parseInt(item.id)].isSelected = false
      }
    }
    this.setData({
      items: this.data.items
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})