// pages/found/found.js
var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //发现tab
    tablist: null,
    //发现item
    list: null,
    //发现当前数量
    currentcount: 0,
    //发现总数
    totalcount: 0,
    //每次加载数量
    loadcount: 5,
    curTabId: "0", //当前tabid
    isShowFloatTab: false //是否显示悬浮tab
      ,
    web_url: null,
  },
  clickData: function(res) {
    if (res.currentTarget.dataset.item.data_type == 1) {
      var web_url = res.currentTarget.dataset.item.text_url;
      wx.setStorageSync('web_url', web_url);
      wx.navigateTo({
        url: '/pages/weburl/weburl',
      })
    } else {
      wx.navigateTo({
        url: '/pages/commodityinfo/commodityinfo?id=' + res.currentTarget.dataset.item.img_product_id,
      })
    }
  },
  loadexploretaglist: function() {
    var that = this;
    var loadcount = that.data.loadcount;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_explore_tag_list',
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            tablist: res.data.list
          })
          wx.request({
            url: 'https://efreshness.cn/overseas_server_test/mp/query_explore_data_list?tag_id=0',
            success: function(res) {
              if (res.data.code == 0) {
                that.setData({
                  list: res.data.list,
                  totalcount: res.data.total_page * loadcount,
                  currentcount: util.getHsonLength(res.data.list)
                })
              }
            },
            fail: function(res) {
              console.log("加载失败,错误：" + res);
            }
          })
        }
      },
      fail: function(res) {
        console.log("加载失败,错误：" + res);
      }
    })
  },
  toFoundDetail: function(res) {

  },
  onScrolltolower: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var id = that.data.curTabId;
    var loadcount = that.data.loadcount;
    var totalcount = that.data.totalcount;
    var currentcount = that.data.currentcount;
    if (currentcount < totalcount) {
      var pageindex = parseInt(((loadcount + currentcount) / loadcount));
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/query_explore_data_list?tag_id=' + id + '&cur_page=' + pageindex,
        success: function(res) {
          if (res.data.code == 0) {
            for (var item in res.data.list) {
              that.data.list.push(res.data.list[item]);
            }
            that.setData({
              list: that.data.list,
              currentcount: pageindex * loadcount
            })
            wx.hideLoading();
          }
        },
        fail: function(res) {
          console.log("加载失败,错误：" + res);
        }
      })
    }
  },
  /**
   * 点击tab切换加载不同数据
   * @param  {[type]} event 
   * @return {[type]}       
   */
  clickTab: function(event) {
    var that = this;
    var id = event.detail.id;
    var loadcount = that.data.loadcount;
    that.setData({
      curTabId: id,
    });
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_explore_data_list?tag_id=' + id,
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            list: res.data.list,
            totalcount: res.data.total_page * loadcount,
            currentcount: util.getHsonLength(res.data.list)
          })
        }
      },
      fail: function(res) {
        console.log("加载失败,错误：" + res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadexploretaglist();
    this.getScrollTop();
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
  onReachBottom: function(e) {
    this.onScrolltolower(e);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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


})