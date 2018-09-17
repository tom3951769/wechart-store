// pages/bare/bare.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    help_id:null,
  },
  getdata(id, code) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_barehelp_share_info?help_id=' + id + '&code=' + code,
      header: {
        s: app.globalData.userInfo.session
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          if (res.data.is_creater != null) {
            if (res.data.is_creater == 0) {
              var now = new Date();
              var total_micro_second = res.data.failure_time - now;
              util.countdown(total_micro_second, res.data, that);
              that.setData({
                list: res.data,
              })
            } else {
              wx.redirectTo({
                url: '/pages/mybare/mybare?id=' + res.data.product_id,
              })
            }
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.id != null) {
        this.setData(
          {
            help_id: options.id
          }
        )
        this.login().then((res) => {
          this.getdata(options.id, res)
        }).catch((res) => {
          console.log('登陆失败')
        });
      }
    }
  },
  login() {
    return new Promise(function(resolve, reject) {
      // 登录
      wx.login({
        success: res => {
          var code = res.code;
          if (code != null) {
            var data = app.globalData;
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + data.appid + '&secret=' + data.secret + '&js_code=' + code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              success: function(res) {
                var jscode2session = res.data;
                wx.setStorageSync('jscode2session', jscode2session); //存储openid  
                resolve(code);
              }
            })
          }
        }
      })
    })
  },
  goHelp(e) {
    var that = this
    let userinfo_json = {}
    let userinfo = e.detail.userInfo
    let jscode2session = wx.getStorageSync('jscode2session')
    let help_id = that.data.help_id
    userinfo_json.openid = jscode2session.openid
    userinfo_json.unionid = jscode2session.unionid
    userinfo_json.headimgurl = userinfo.avatarUrl
    userinfo_json.nickname = userinfo.nickName
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/barehelp_submit?help_id=' + help_id + '&userinfo_json=' + JSON.stringify(userinfo_json),
      success(res) {
        if (res.data.code == 0) {}
      },
      fail(res) {

      }
    })
  },
  onClick: function(e) {
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + e.detail.id,
    })
  },
  goHome(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goCampaign(e) {},
  goShareModule(e) {
    wx.showToast({
      title: '敬请期待',
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