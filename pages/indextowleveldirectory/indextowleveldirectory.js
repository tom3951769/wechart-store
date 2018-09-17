// pages/indextowleveldirectory/indextowleveldirectory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodity: [{
        id: '1',
        url: '/pages/images/pineapple.jpg',
        name: '商品1',
        price: '123'
      },
      {
        id: '2',
        url: '/pages/images/pineapple.jpg',
        name: '商品2',
        price: '223'
      },
      {
        id: '3',
        url: '/pages/images/pineapple.jpg',
        name: '商品3',
        price: '323'
      },
      {
        id: '4',
        url: '/pages/images/pineapple.jpg',
        name: '商品4',
        price: '423'
      }
    ],
    list: [],
    curTabId: "0",
    currentcount: 0,
    totalcount: 0,
    loadcount: 6,
    title: '模块页面',
    category_id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.category_id != null && options.title != null) {
        var category_id = options.category_id
        var title = options.title
        this.setData({
          category_id: category_id
        })
        wx.setNavigationBarTitle({
          title: title
        })
        this.query_main_category_data(category_id);
      }
    }
  },
  query_main_category_data(id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_main_category_data?category_id=' + id,
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          that.setData({
            list: res.data,
          })
        }
      }
    })
  },
  toCategoryinfo(e) {
    wx.navigateTo({
      url: '/pages/moduleinfo/moduleinfo?category_id=' + e.currentTarget.dataset.items.category_id,
    })
  },
  toModuleinfo(e) {
    wx.navigateTo({
      url: '/pages/moduleinfo/moduleinfo?item=' + JSON.stringify(e.currentTarget.dataset.items)
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