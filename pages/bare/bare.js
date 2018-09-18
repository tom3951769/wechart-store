// pages/bare/bare.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    help_id: null,
  },
  getdata(id) {
    var that = this;
    var code = app.globalData.userInfo.logincode
    var openid = app.globalData.userInfo.openid
    var unionid = app.globalData.userInfo.unionid
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_barehelp_share_info?help_id=' + id + '&code=' + code + '&openid=' + openid + '&unionid=' + unionid,
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
        this.setData({
          help_id: options.id
        })
        this.getdata(options.id)
      }
    }
  },
  goHelp(e) {
    var that = this
    // if (that.data.list.subscribe == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '未关注公众号，先关注公众号在来助力哦。',
    //     success(res)
    //     {
    //       if (res.confirm) {
    //         wx.previewImage({
    //           urls: [that.data.list.qr_img],
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
    if (that.data.list.is_helped == 1) {
      wx.showModal({
        title: '提示',
        content: '已助力过，不可重复助力',
        showCancel:false,
      })
      return
    }
    let userinfo_json = {}
    let userinfo = e.detail.userInfo
    let help_id = that.data.help_id
    userinfo_json.openid = app.globalData.userInfo.openid
    userinfo_json.unionid = app.globalData.userInfo.unionid
    userinfo_json.headimgurl = userinfo.avatarUrl
    userinfo_json.nickname = userinfo.nickName
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/barehelp_submit?help_id=' + help_id + '&userinfo_json=' + JSON.stringify(userinfo_json),
      success(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '助力成功',
          })
          that.getdata(help_id)
        } else {
          wx.showModal({
            title: '提示',
            content: '助力失败，系统错误',
            showCancel:false,
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '系统错误，助力失败',
          showCancel: false,
        })
        console.log('系统错误，助力失败：' + res)
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