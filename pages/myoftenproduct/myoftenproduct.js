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
      id: "0",
      isSelect: false,
      title: "我的收藏"
    }, ], //tabbar数组
    curTabId: "0", //当前tabid
    isShowFloatTab: false, //是否显示悬浮tab
    list: [],
    totalcount: 0,
    loadcount: 6,
    currentcount: 0,
    startX: 0,
    startY: 0,
  },

  touchstart(e) {
    //开始触摸时 重置所有删除
    this.data.list.forEach((item) => {
      if (item.isTouchMove) //只操作为true的
        item.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    })
  },
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      list: that.data.list
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del: function (e) {
    this.data.list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      list: this.data.list
    })

  },

  toCommodity(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + id,
    })
  },
  addcard(e) {
    var that = this;
    var commodity_id = e.target.dataset.item;
    var product_count = 1;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/add_to_cart?product_id=' + commodity_id + '&product_count=' + product_count,
      header: {
        s: app.globalData.userInfo.session
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '加入成功！',
          })
          var car_count = parseInt(wx.getStorageSync('car_count')) + 1;
          wx.setStorageSync('car_count', car_count);
        } else {
          wx.showToast({
            title: '加入失败！',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '加入失败！',
        })
        console.log('加入购物车失败' + res);
      },
      complete: function () {
        that.setData({
          addToShoppingCartHidden: true,
          isShowFloatTab: false
        })
      }
    })


  },
  getfollowproductlist: function() {
    var that = this;
    //获取收藏商品数量
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_always_product_list?cur_page=1&page_size=' + that.data.loadcount,
      header: {
        s: app.globalData.userInfo.session
      },
      success: function(res) {
        if (res.data.code) {
          that.setData({
            list: res.data.list,
            totalcount: res.data.product_count,
            currentcount: that.data.loadcount
          })
        }
      },
      fail: function(res) {
        console.log(res);
      }
    })
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
        url: 'https://efreshness.cn/overseas_server_test/mp/query_always_product_list?cur_page=' + pageindex + '&page_size=' + loadcount,
        header: {
          s: app.globalData.userInfo.session
        },
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
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getScrollTop();
    this.getfollowproductlist();
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

  }
})