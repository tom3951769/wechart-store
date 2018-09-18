// pages/seckill/seckill.js

var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    curTabId: "0",
    currentcount: 0,
    totalcount: 0,
    loadcount: 6,
    title: '模块页面',
    type_number: 0,
    type_id: null,
    tabs: [],
    seckilldata: {
      id: '',
      title: '',
      seckilltime: '22:00-0300',
      residuehours: '00',
      residueminute: '50',
      residuesecond: '58'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.module_id != null && options.title != null) {
        this.data.type_id = options.module_id
        wx.setNavigationBarTitle({
          title: options.title //页面标题为路由参数
        })
        this.query_flashsale_module_product_list(this.data.type_id, 1, this.data.loadcount, 0)
      }
    }
  },
  query_flashsale_module_product_list(module_id, cur_page, page_size, load_type) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_flashsale_module_product_list?module_id=' + module_id + '&cur_page=' + cur_page + '&page_size=' + page_size,
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          if (load_type == 1) {
            for (var item in res.data.list) {
              that.data.list.list.push(res.data.list[item]);
            }
          } else {
            var time = res.data.end_date - res.data.start_date
            util.countdown(time, res.data, that);
            res.data.start_date = util.timestamptodate(res.data.start_date)
            res.data.end_date = util.timestamptodate(res.data.end_date)
            that.data.list = res.data.list;
          }
          that.setData({
            list: that.data.list,
            totalcount: res.data.total_page * that.data.loadcount,
            currentcount: cur_page * that.data.loadcount
          })
        }
      }
    })

  },
  goPay(e) {
    var item = e.detail.item
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + item.product_id,
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
    var that = this;
    var loadcount = that.data.loadcount;
    var totalcount = that.data.totalcount;
    var currentcount = that.data.currentcount;
    var type_id = that.data.type_id;
    var type_number = that.data.type_number;
    if (currentcount < totalcount) {
      var pageindex = parseInt(((loadcount + currentcount) / loadcount));
      that.query_flashsale_module_product_list(type_id, pageindex, loadcount, 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})