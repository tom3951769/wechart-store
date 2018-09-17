var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        tag_id: "0",
        isSelect: true,
        tag_name: "全部"
      },
      {
        tag_id: "1",
        isSelect: false,
        tag_name: "待付款"
      },
      {
        tag_id: "2",
        isSelect: false,
        tag_name: "待发货"
      },
      {
        tag_id: "3",
        isSelect: false,
        tag_name: "待收货"
      },
      {
        tag_id: "4",
        isSelect: false,
        tag_name: "已收货"
      },
    ], //tabbar数组
    curTabId: "0", //当前tabid
    isShowFloatTab: false, //是否显示悬浮tab
    list: [],
    currentcount: 0,
    totalcount: 0,
    loadcount: 6,
  },
  getOrderlist(status, cur_page, page_size, load_type) {
    var that = this
    var list = []
    var urlString = ''
    if (status == null) {
      urlString = 'https://efreshness.cn/overseas_server_test/mp/query_order_list?cur_page=' + cur_page + '&page_size=' + page_size
    } else {
      urlString = 'https://efreshness.cn/overseas_server_test/mp/query_order_list?status=' + status + '&cur_page=' + cur_page + '&page_size=' + page_size
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: urlString,
      header: {
        s: app.globalData.userInfo.session,
      },
      success(res) {
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
            totalcount: res.data.total_page * page_size,
            currentcount: cur_page * page_size
          })
          wx.hideLoading()
        }
      }
    })
  },
  onCancelOrder(e) {
    var that = this
    var order_id = e.currentTarget.dataset.item.order_id
    if (order_id != null) {
      // wx.showLoading({
      //   title: '取消中',
      // })
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/cancel_order?order_id=' + order_id,
        header: {
          s: app.globalData.userInfo.session,
        },
        success(res) {
          if (res.data.code == 0) {
            // wx.showToast({
            //   title: '取消成功',
            // })
            // wx.hideLoading()
            if (that.data.curTabId != 0) {
              that.getOrderlist((that.data.curTabId - 1), 1, that.data.loadcount, 0)
            } else {
              that.getOrderlist(null, 1, that.data.loadcount, 0)
            }
          } else {
            wx.showToast({
              title: '取消失败',
            })
            console.log(res)
          }
        }
      })
    }
  },
  onBuy(e) {
    var that = this
    var order_id = e.currentTarget.dataset.item.order_id
    if (order_id != null) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/query_order_product_list?order_id=' + order_id,
        header: {
          s: app.globalData.userInfo.session,
        },
        success(res) {
          if (res.data.code == 0) {
            var order_info = {
              "order_list": []
            }
            for (var index in res.data.list) {
              var product = {
                "product_id": (res.data.list[index].product_id).toString(),
                "total_count": parseInt(res.data.list[index].product_count),
                "total_price": res.data.list[index].product_count * parseFloat(res.data.list[index].price).toFixed(2),
              }
              order_info.order_list.push(product)
            }
            wx.navigateTo({
              url: '/pages/confirmorder/confirmorder?order_info=' + JSON.stringify(order_info),
            })
          }
        }
      })
    }
  },
  toPay(e) {
    var item = e.currentTarget.dataset.item
    var json = {
      "order_id": item.order_id,
      "pay_money": item.total_price,
    }
    wx.navigateTo({
      url: '/pages/pay/pay?json=' + JSON.stringify(json),
    })
  },
  toOrderinfo(e) {
    var order_id = e.currentTarget.dataset.item.order_id
    if (order_id != null) {
      wx.navigateTo({
        url: '/pages/orderinfo/orderinfo?order_id=' + order_id,
      })
    }
  },
  toOderTracking(e) {
    var order_id = e.currentTarget.dataset.item.order_id
    if (order_id != null) {
      wx.navigateTo({
        url: '/pages/ordertracking/ordertracking?order_id=' + order_id,
      })
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
    if (options != null) {
      if (options.id != null) {
        for (var tab in this.data.tabs) {
          var isselected = this.data.tabs[tab].isSelect;
          var param = "tabs[" + tab + "].isSelect";
          if (tab == options.id) {
            this.setData({
              [param]: true
            })
          } else {
            this.setData({
              [param]: false
            })
          }
        }
        this.setData({
          curTabId: options.id,
        })
        if (this.data.curTabId != 0) {
          this.getOrderlist((this.data.curTabId - 1), 1, this.data.loadcount, 0)
        } else {
          this.getOrderlist(null, 1, this.data.loadcount, 0)
        }
      } else {
        this.getOrderlist(null, 1, this.data.loadcount, 0)
      }
    }
    this.getScrollTop();
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
    if (this.data.curTabId != 0) {
      this.getOrderlist((this.data.curTabId - 1), 1, this.data.loadcount, 0)
    } else {
      this.getOrderlist(null, 1, this.data.loadcount, 0)
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
    var that = this;
    var id = that.data.curTabId
    var loadcount = that.data.loadcount;
    var totalcount = that.data.totalcount;
    var currentcount = that.data.currentcount;
    if (currentcount < totalcount) {
      var pageindex = parseInt(((loadcount + currentcount) / loadcount));
      if (id != 0) {
        that.getOrderlist((id - 1), pageindex, that.data.loadcount, 1)
      } else {
        that.getOrderlist(null, pageindex, that.data.loadcount, 1)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})