// pages/mybrand/mybrand.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentcount: 0,
    totalcount: 0,
    loadcount: 9,
    list: [],
  },
  toBrand(e) {
    wx.navigateTo({
      url: '/pages/brand/brand?brand_id=' + e.currentTarget.dataset.item.brand_id,
    })
  }
  ,
  getbrandlist(cur_page, page_size) {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_my_brand_list?cur_page=' + cur_page + '&page_size=' + page_size,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({
            list: res.data.list,
            currentcount: page_size * cur_page,
            totalcount: res.data.total_page * page_size
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getbrandlist(1, this.data.loadcount)
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