// pages/systemsetting/systemsetting.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    settingbutton: [{
        id: '0',
        nodeName: '个人信息',
        navigateUrl:''
      },
      {
        id: '1',
        nodeName: '我的实名认证',
        navigateUrl: '/pages/realnameauthentication/realnameauthentication'
      },
      {
        id: '2',
        nodeName: '我的收货地址',
        navigateUrl: '/pages/myshippingaddress/myshippingaddress'
      },
    ],
    settingbutton1: [{
      id: '0',
      nodeName: '意见反馈',
      navigateUrl: ''
    },
    {
      id: '1',
      nodeName: '关于我们',
      navigateUrl: ''
    },
    ]
  },
  toNavigateUrl:function(e)
  {
    var navigateUrl = e.currentTarget.dataset.items.navigateUrl;
    wx.navigateTo({
      url: navigateUrl,
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