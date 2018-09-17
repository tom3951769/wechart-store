// pages/commodityinfo/commodityinfo.js
var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();

/* 毫秒级秒杀倒计时 */
function countdown(total_micro_second, json, that) {
  dateformat(total_micro_second, json) //格式化时间
  that.setData({
    list: json,
  })
  if (total_micro_second <= 0) {
    // timeout则跳出递归
    return;
  }

  //settimeout实现倒计时效果
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 1000;
    countdown(total_micro_second, json, that);
  }, 1000) //注意毫秒的步长受限于系统的时间频率，于是我们精确到0.01s即10ms
}

// 时间格式化输出，如1天天23时时12分分12秒秒12 。每10ms都会调用一次
function dateformat(micro_second, json) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // // 天数
  // var day = Math.floor(second / 3600 / 24);
  // 总小时
  var hr = Math.floor(second / 3600);
  // 小时位
  var hr2 = hr % 24;
  json.hour = hr2;
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  json.minute = min;
  // 秒位
  var sec = (second - hr * 3600 - min * 60); // equal to => var sec = second % 60;
  json.second = sec;
  // 毫秒位，保留2位
  // var micro_sec = Math.floor((micro_second % 1000) / 10);
}

Page({
  /**
   * 页面的初始数据
   */
  data: {

    article: null,
    commodity_id: null,
    list: [],
    product_count: 1,
    selecte_property: '',
    car_count: 0,
    follow_flag: false,
    reserve_end_date_status: 0,
    flashsale_end_date_status: 0,
    button_disable: 0,
    order_list: null,
    swipertabdata: [{
        index: '0',
        name: '商品详情'
      },
      {
        index: '1',
        name: 'FAQ'
      }
    ],
    addToShoppingCartHidden: true,
    curTabId: "news",
    isShowFloatTab: false,
    isAddCart: true,
    currentTab: 0,
  },
  toBare(e) {
    wx.navigateTo({
      url: '/pages/mybare/mybare?id=' + e.currentTarget.dataset.item.product_id,
    })
  },
  addBuyCountClick: function(e) {
    this.setData({
      product_count: parseInt(this.data.product_count) + 1
    })
  },
  lessenBuyCountClick: function(e) {
    if (this.data.product_count > 1) {
      this.setData({
        product_count: parseInt(this.data.product_count) - 1
      })
    }
  },
  inputBuyCount: function(e) {
    this.setData({
      product_count: e.detail.value
    })
  },

  toNavigateUrl: function(e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/weburl/weburl?web_url=' + e.currentTarget.dataset.tourl,
    })
  },
  
  onCancel: function() {
    var that = this;
    that.setData({
      addToShoppingCartHidden: true,
      isShowFloatTab: false
    })
  },
  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        article: e.target.dataset.items
      })
    }
    WxParse.wxParse('article', 'html', that.data.article, that, 5);
  },
  immeBuy: function() {
    var that = this;
    that.setData({
      addToShoppingCartHidden: false,
      isShowFloatTab: true,
      isAddCart: false,
    })
    // wx.navigateTo({
    //   url: '/pages/confirmorder/confirmorder',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  swiperclickTab: function(event) {
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
  },
  addCar: function() {
    var that = this;
    that.setData({
      addToShoppingCartHidden: false,
      isShowFloatTab: true,
      isAddCart: true,
    })
  },
  toCar: function() {
    wx.switchTab({
      url: '/pages/shoppingcart/shoppingcart',
    })
  },
  addlike: function(res) {
    var that = this;
    if (that.data.list.follow_flag == 0) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/follow_product_submit?product_id=' + that.data.commodity_id,
        header: {
          s: app.globalData.userInfo.session
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '收藏成功',
            })
            that.data.list.follow_flag = 1;
            that.setData({
              lsit: that.data.list,
              follow_flag: true
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '收藏失败，' + res.data.msg,
            })
          }
        }
      })
    } else {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/unfollow_product_submit?product_id=' + that.data.commodity_id,
        header: {
          s: app.globalData.userInfo.session
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '取消收藏',
            })
            that.data.list.follow_flag = 0;
            that.setData({
              lsit: that.data.list,
              follow_flag: false
            })
          }
        }
      })
    }
  },
  addToShoppingCart: function(res) {
    var that = this;
    if (that.data.isAddCart) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/add_to_cart?product_id=' + that.data.commodity_id + '&product_count=' + that.data.product_count,
        header: {
          s: app.globalData.userInfo.session
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '加入成功！',
            })
            that.setData({
              car_count: parseInt(that.data.car_count) + that.data.product_count
            })
            wx.setStorageSync('car_count', that.data.car_count);
          } else {
            console.log('加入购物车失败' + res);
            wx.showToast({
              title: '加入失败！',
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '加入失败！',
          })
          console.log('加入购物车失败' + res);
        },
        complete: function(res) {
          that.setData({
            addToShoppingCartHidden: true,
            isShowFloatTab: false
          })
        }
      })
    } else {
      var order_info = {
        "order_list": [{
          "product_id": that.data.commodity_id,
          "total_count": that.data.product_count,
          "total_price": (that.data.product_count * that.data.list.price)
        }]
      }
      wx.navigateTo({
        url: '/pages/confirmorder/confirmorder?order_info=' + JSON.stringify(order_info),
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //设置商品ID
    var that = this;
    that.setData({
      commodity_id: options.id
    })
    var car_count = wx.getStorageSync('car_count');
    if (car_count > 0) {
      that.setData({
        car_count: car_count
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onSelected(e) {
    var that = this
    var spec_value_id = e.detail.spec_value_id
    var product_id = ''
    that.data.list.spec_map_list.map((item) => {
      if (item.spec_key == spec_value_id) {
        product_id = item.product_id
      }
    })
    that.getProductInfo(product_id)
  },
  getProductInfo(product_id)
  {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_product_detail?product_id=' + product_id,
      header: {
        s: app.globalData.userInfo.session
      },
      success(e) {
        if (e.data.code == 0) {
          that.setData({
            list: e.data,
            article: e.data.detail_content,
            follow_flag: e.data.follow_flag == 1 ? true : false
          })
          if (e.data.flashsale_flag == 1) {
            countdown(e.data.flashsale_start_date, e.data, that)
          }
          that.checkStatus(e.data);
          WxParse.wxParse('article', 'html', that.data.article, that, 5);
          var lsit = e.data.spec_list.filter((item) => {
            that.data.selecte_property = ''
            item.spec_value_list.map((spec_value_list_item) => {
              if (spec_value_list_item.is_selected == 1) {
                that.data.selecte_property += " " + spec_value_list_item.spec_value_name;
                that.setData({
                  selecte_property: that.data.selecte_property
                })
              }
            })
            return item;
          })
        }
      }
    })
  }
  ,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (that.data.commodity_id != null) {
      var id = that.data.commodity_id;
      if (id != null) {
        that.getProductInfo(id)
      }
    }
  },
  checkStatus(list) {
    var that = this;
    if (list.reserve_flag == 1) {
      var now = new Date();
      if (list.reserve_end_date < now) {
        that.setData({
          reserve_end_date_status: 1
        })
      }
    }
    if (list.flashsale_flag == 1) {
      if (list.flashsale_end_date < now) {
        that.setData({
          flashsale_end_date_status: 1
        })
      }
    }
    if (that.data.reserve_end_date_status == 1 || that.data.flashsale_end_date_status == 1) {
      that.setData({
        button_disable: 1
      })
    }
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