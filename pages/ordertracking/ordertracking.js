// pages/ordertracking/ordertracking.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    json: null,
  },
  toLogistics(e) {
    var id = e.currentTarget.dataset.item.pkg_id
    wx.navigateTo({
      url: '/pages/checkthelogistics/checkthelogistics?pkg_id=' + id,
    })
  },
  getPKGList(order_id) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_order_pkg_list?order_id=' + order_id,
      header: {
        s: app.globalData.userInfo.session,
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({
            json: res.data
          })
        }
        else {
          wx.showToast({
            title: '未找到包裹信息',
          })
          console.log(res)
         }
      },
      fail(res) {
        wx.showToast({
          title: '未找到包裹信息',
        })
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.order_id != null) {
        this.setData({
          order_id: options.order_id
        })
        this.getPKGList(options.order_id)
      }
    }
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