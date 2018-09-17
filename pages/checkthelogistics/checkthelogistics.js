// pages/checkthelogistics/checkthelogistics.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logistics_company: '顺丰快递',
    pkg_id: null,
    json: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.pkg_id != null) {
        this.setData({
          pkg_id: options.pkg_id
        })
        this.getLogistics(options.pkg_id)
      }
    }
  },
  getLogistics(pkg_id) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_order_logistics_list?pkg_id=' + pkg_id,
      header: {
        s: app.globalData.userInfo.session,
      },
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading()
          for (var index in res.data.list) {
            if (index == 0) {
              res.data.list[index].currentindex = 1
            } else if (index == util.getHsonLength(res.data.list) - 1) {
              res.data.list[index].currentindex = 0
            } else {
              res.data.list[index].currentindex = 2
            }
          }
          that.setData({
            json: res.data
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取物流信息错误，原因：' + res.data.msg,
          })
          console.log(res)
        }
      }
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