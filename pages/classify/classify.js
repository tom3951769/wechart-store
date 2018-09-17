// pages/coupon/coupon.js
var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //发现当前数量
    currentcount: 0,
    //发现总数
    totalcount: 0,
    //每次加载数量
    loadcount: 6,
    //搜索默认词
    search_word: null,
    search_input: '',
    tabs: [{
        tag_id: "0",
        isSelect: true,
        tag_name: "人气"
      },
      {
        tag_id: "1",
        isSelect: false,
        tag_name: "销量"
      },
      {
        tag_id: "2",
        isSelect: false,
        tag_name: "新品"
      },
      {
        tag_id: "3",
        isSelect: false,
        tag_name: "价格"
      },
    ], //tabbar数组
    curTabId: "0", //当前tabid
    isShowFloatTab: false //是否显示悬浮tab
      ,
    list: [],
  },
  getcommoditylist: function(keyword, sort_field, sort_type, cur_page, page_size, load_type) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_search_product_list?keyword=' + keyword + '&sort_field=' + sort_field + '&sort_type=' + sort_type + '&cur_page=' + cur_page + '&page_size=' + page_size,
      header: {
        s: app.globalData.userInfo.session
      },
      success: function(res) {
        if (res.data.code == 0) {
          if (load_type == 1) {
            for (var item in res.data.list) {
              that.data.list.push(res.data.list[item]);
            }
          } else {
            that.data.list = res.data.list;
          }
          that.setData({
            list: that.data.list,
            currentcount: cur_page * page_size,
            totalcount: res.data.total_page * page_size
          })
          wx.hideLoading();
        }
      }
    })
  },
  onScrolltolower: function() {
    var that = this;
    var loadcount = that.data.loadcount;
    var totalcount = that.data.totalcount;
    var currentcount = that.data.currentcount;
    var search_word = that.data.search_word;
    if (that.data.search_input == null) {
      that.data.search_input = search_word;
    }
    var sort_field = parseInt(that.data.curTabId) + 1;
    if (currentcount < totalcount) {
      var pageindex = parseInt(((loadcount + currentcount) / loadcount));
      that.getcommoditylist(that.data.search_input, sort_field, 1, pageindex, loadcount, 1);
    }
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
    if (options != null) {
      if (options.keyword != null) {
        var search_input = options.keyword;
        this.setData({
          search_input: search_input
        })
        this.getcommoditylist(this.data.search_input, 1, 1, 1, this.data.loadcount, 0);
      }
      if (options.banner_id!=null)
      {
        var banner_id = options.banner_id;

      }
    }
    var search_word = wx.getStorageSync('search_word');
    this.setData({
      search_word: search_word
    })
  },
  onSearch: function(res) {
    var sort_field = parseInt(this.data.curTabId) + 1;
    this.getcommoditylist(this.data.search_input,sort_field, 1, 1, this.data.loadcount, 0);
  },
  onSearchinput: function(res) {
    this.setData({
      search_input: res.detail.value
    })
  },
  onClick: function(e) {
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + e.detail.id,
    })
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
    var sort_field = parseInt(this.data.curTabId) + 1;
    this.getcommoditylist(this.data.search_input, sort_field, 1, 1, this.data.loadcount, 0);
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
    this.onScrolltolower();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})