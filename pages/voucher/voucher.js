// pages/coupon/coupon.js
var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        tag_id: "0",
        isSelect: true,
        tag_name: "未使用"
      },
      {
        tag_id: "1",
        isSelect: false,
        tag_name: "未生效"
      },
      {
        tag_id: "2",
        isSelect: false,
        tag_name: "已使用"
      },
      {
        tag_id: "3",
        isSelect: false,
        tag_name: "已过期"
      },
    ], //tabbar数组
    curTabId: "0", //当前tabid
    isShowFloatTab: false //是否显示悬浮tab
      ,
    coupoms: [
    ]
  },
  getvoucher: function(status) {
    var that = this;
    if (status == 3) {
      status = -1;
    }
    if (status == 1) {
      status = 2;
    }
    if (status == 2) {
      status = 1;
    }
    //获取代金卷
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_cash_coupon_list?status=' + status,
      header: {
        s: app.globalData.userInfo.session
      },
      success: function(res) {
        if (res.data.code) {
          that.setData({
            coupons: res.data.list
          })
        }
      }
    })
  },
  /**
   * 禁止Swiper手动滑动
   */
  catchTouchMove: function() {
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getScrollTop();
    this.getvoucher(0);
  },
  /**
   * 获得滑动导致悬浮开始的高度
   * @return {[type]} [description]
   */
  getScrollTop: function() {
    var that = this;
    if (wx.canIUse('getSystemInfo.success.screenWidth')) {
      wx: wx.getSystemInfo({
        success: function(res) {
          rate = res.screenWidth / 750;
          floatTop = 104 * rate;
          that.setData({
            scrollTop: 104 * res.screenWidth / 750,
            scrollHeight: res.screenHeight / (res.screenWidth / 750) - 128,
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPageScroll: function(event) {
    var scrollTop = event.scrollTop;
    if (scrollTop >= floatTop && !this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: true,
      });
    } else if (scrollTop < floatTop && this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: false,
      });
    }
  },

  /**
   * 点击tab切换
   * @param  {[type]} event 
   * @return {[type]}       
   */
  clickTab: function(event) {
    var id = event.detail.id;
    this.data.curTabId = id;
    for (var i = 0; i < this.data.tabs.length; i++) {
      if (id == this.data.tabs[i].id) {
        this.data.tabs[i].isSelect = true;
      } else {
        this.data.tabs[i].isSelect = false;
      }
    }
    this.setData({
      tabs: this.data.tabs,
      curTabId: this.data.curTabId,
    });

    this.getvoucher(id);
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