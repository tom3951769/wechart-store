var app = getApp();
var util=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {
      avatarUrl: '/pages/images/defultwecharticon.jpg',
      nickName: '桃子'
    },
    myselfnavigation: [{
        id: '1',
        url: '/pages/images/myselficon1.png',
        name: '待付款',
        navigateUrl: '/pages/myorder/myorder?'
      },
      {
        id: '2',
        url: '/pages/images/myselficon2.png',
        name: '待发货',
        navigateUrl: '/pages/myorder/myorder'
      },
      {
        id: '3',
        url: '/pages/images/myselficon3.png',
        name: '待收货',
        navigateUrl: '/pages/myorder/myorder'
      },
      {
        id: '4',
        url: '/pages/images/myselficon4.png',
        name: '已收货',
        navigateUrl: '/pages/myorder/myorder'
      },
    ],
    myOrderButton:
      [{
        id: '0',
        nodeName: '我的订单',
        NavigateUrl: '/pages/myorder/myorder?id=0',
        text: '全部订单'
      },]
    ,
    classify: [
      {
        id: '0',
        nodeName: '我的优惠卷',
        NavigateUrl: '/pages/coupon/coupon',
        text: '1'
      },
      {
        id: '1',
        nodeName: '我的代金卷',
        NavigateUrl: '/pages/voucher/voucher',
        text: '1'
      },
      {
        id: '2',
        nodeName: '我的品牌',
        NavigateUrl: '/pages/mybrand/mybrand',
        text: '1'
      },
      {
        id: '3',
        nodeName: '我的收藏',
        NavigateUrl: '/pages/mylikes/mylikes',
        text: '1'
      },
      {
        id: '4',
        nodeName: '常购商品',
        NavigateUrl: '/pages/myoftenproduct/myoftenproduct',
        text: '1'
      },
      {
        id: '5',
        nodeName: '收货地址',
        NavigateUrl: '/pages/myshippingaddress/myshippingaddress',
        text: '1'
      },
      {
        id: '6',
        nodeName: '助力专享购',
        NavigateUrl: '/pages/mybarelist/mybarelist',
        text: '1'
      },
    ]

  },
  toSetting: function() {
    wx.navigateTo({
      url: '/pages/systemsetting/systemsetting',
    })
  },
  toMyorder: function() {
    wx.navigateTo({
      url: '/pages/myorder/myorder?id=0',
    })
  },
  toOrder: function(e) {
    var id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: '/pages/myorder/myorder?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
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
    var that = this;
    var url = "userinfo.avatarUrl";
    var name = "userinfo.nickName";
    that.setData({
      [url]: app.globalData.userInfo.headimgurl,
      [name]: app.globalData.userInfo.nickname,
    })
    that.loadRoll();
  },
  toNavigateUrl: function(res) {
    var navigateUrl = this.data.classify[res.detail.id].NavigateUrl;
    wx.navigateTo({
      url: navigateUrl,
    })

  },
  loadRoll:function()
  {
    var that=this;
    //获取优惠卷数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_coupon_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success:function(res)
      {
          if(res.data.code)
          {
            that.data.classify[0].text = res.data.coupon_count;
            that.setData(
              {
                classify: that.data.classify
              }
            )
          }
          
      }
    })
    //获取代金卷数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_cash_coupon_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function (res) {
        if (res.data.code) {
          that.data.classify[1].text = res.data.coupon_count;
          that.setData(
            {
              classify: that.data.classify
            }
          )
        }
        
      }
    })
    //获取我的品牌数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_my_brand_list?cur_page=1&page_size=6',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function (res) {
        if (res.data.code) {
          that.data.classify[2].text = res.data.brand_count;
          that.setData(
            {
              classify: that.data.classify
            }
          )
        }

      }
    })
    //获取我的收藏数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_follow_product_list?cur_page=1&page_size=1',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function (res) {
        if (res.data.code) {
          var product_count = res.data.product_count;
          that.data.classify[3].text = product_count;
          that.setData(
            {
              classify: that.data.classify
            }
          )
        }
      }
    })
    //获取常购商品数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_always_product_list?cur_page=1&page_size=999',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function (res) {
        if (res.data.code) {
          var product_count = util.getHsonLength(res.data.list);
          that.data.classify[4].text = product_count;
          that.setData(
            {
              classify: that.data.classify
            }
          )
        }
      }
    })

    //获取收货地址数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_address_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function (res) {
        if (res.data.code) {
          var product_count = util.getHsonLength(res.data.list);
          that.data.classify[5].text = product_count;
          that.setData(
            {
              classify: that.data.classify
            }
          )
        }
      }
    })
    //获取我的助力列表数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_my_barehelp_list?cur_page=' + 1 + '&page_size=' + 99,
      header: {
        s: app.globalData.userInfo.session
      },
      success: function (res) {
        if (res.data.code) {
          var product_count = util.getHsonLength(res.data.list);
          that.data.classify[6].text = product_count;
          that.setData(
            {
              classify: that.data.classify
            }
          )
        }
      }
    })
   
  }
   ,
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