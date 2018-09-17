// pages/shoppingcart/shoppingcart.js

var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    list: null,
    buycount: 0,
    totalprice: 32,
    toprightcorner: "编辑",
    isRedact: false,
    selectedAll: true
  },
  toCommodity(e) {
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + e.detail.id,
    })
  },
  selectedAllClick: function(res) {
    var that = this;
    var product_list = null;
    if (that.data.selectedAll == true) {
      product_list = that.data.list.filter((item) => {
        item.isSelect = false;
        that.data.selectedAll = false;
        return item;
      })
    } else {
      product_list = that.data.list.filter((item) => {
        item.isSelect = true;
        that.data.selectedAll = true;
        return item;
      })
    }
    that.setData({
      list: product_list,
      selectedAll: that.data.selectedAll
    })
    that.changePrice(product_list);
  },
  toRedact: function(e) {
    if (this.data.isRedact == false) {
      this.setData({
        isRedact: true,
        toprightcorner: "完成"
      })
    } else {
      this.setData({
        isRedact: false,
        toprightcorner: "编辑"
      })
    }
  },
  checkboxChangeClick: function(res) {
    var that = this;
    var product_id = res.detail.id;
    var product_list = that.data.list.filter((item) => {
      if (product_id == item.product_id) {
        if (item.isSelect == true) {
          item.isSelect = false;
        } else {
          item.isSelect = true;
        }
      }
      return item;
    })
    that.setData({
      list: product_list
    })
    that.changePrice(that.data.list);
  },
  removeItemClick: function(e) {
    var that = this;
    var product_ids = e.detail.id;
    var items = that.data.list.filter((item) => {
      return item.product_id != product_ids
    })
    that.deleteProduct(items, product_ids);
  },
  deleteCartItem: function() {
    var that = this;
    var product_ids = '';
    var items = that.data.list.filter((item) => {
      if (item.isSelect == true) {
        product_ids += item.product_id + ',';
      }
      return item.isSelect != true;
    })
    product_ids.trim(',')
    that.deleteProduct(items, product_ids);
  },
  addBuyCountClick: function(e) {
    var that = this;
    var Maxcount = 999;
    var product = null;
    var product_list = that.data.list.filter((item) => {
      if (item.product_id == e.detail.id) {
        Maxcount = item.max;
        product = item;
      }
      return item;
    });
    // if (product.product_count >= product.max) {
    //   wx.showToast({
    //     title: '已经是最大存库',
    //   })
    // } else {
    product.product_count = parseInt(product.product_count) + 1;
    that.setData({
      list: product_list
    })
    that.changePrice(product_list);
    that.changeProductCount(product.product_id, product.product_count);
    // }

  },
  lessenBuyCountClick: function(e) {
    var that = this;
    var Mincount = 0;
    var product = null;
    var product_list = that.data.list.filter((item) => {
      if (item.product_id == e.detail.id) {
        Mincount = item.min;
        product = item;
      }
      return item;
    });
    // if (product.product_count <= product.min) {
    //   wx.showToast({
    //     title: '最少买一件',
    //   })
    // } else {
    if (product.product_count != 0) {
      product.product_count = parseInt(product.product_count) - 1;
      that.setData({
        list: product_list
      })
      that.changePrice(product_list);
      that.changeProductCount(product.product_id, product.product_count);
    }
  },
  immeBuy: function(e) {
    var that = this
    var order_info = {
      "order_list": []
    }
    for (var index in that.data.list) {
      var product = {
        "product_id": (that.data.list[index].product_id).toString(),
        "total_count": parseInt(that.data.list[index].product_count),
        "total_price": that.data.list[index].product_count * parseFloat(that.data.list[index].price).toFixed(2),
      }
      order_info.order_list.push(product)
    }
    wx.navigateTo({
      url: '/pages/confirmorder/confirmorder?order_info=' + JSON.stringify(order_info),
    })
  },
  //跳转主页
  gohome: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onLoad: function(res) {

  },
  onShow: function() {
    var that = this;
    // 请求购物车数据
    var count = app.globalData.userInfo;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_cart_product_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function(res) {
        if (res.data.code == 0) {
          var count = util.getHsonLength(res.data.list);
          if (count > 0) {
            var count = 0;
            var totalprice = 0.0;
            for (var i in res.data.list) {
              var buy_count = parseInt(res.data.list[i].product_count);
              var buy_price = parseFloat(res.data.list[i].price);
              count += buy_count;
              totalprice += buy_price * buy_count;
              res.data.list[i].isSelect = true;
            }
            that.setData({
              buycount: count,
              totalprice: totalprice.toFixed(2),
              list: res.data.list,
              toprightcorner: "编辑",
              isRedact: false,
              selectedAll: true
            })
          }
        }
      },
      fail: function(res) {
        console.log("加载失败,错误：" + res);
      }
    })
  },
  changePrice: function(list) {
    var that = this;
    var count = 0;
    var totalprice = 0.0;
    for (var i in list) {
      var buy_count = parseInt(list[i].product_count);
      var buy_price = parseFloat(list[i].price);
      if (list[i].isSelect == true) {
        count += buy_count;
        totalprice += buy_price * buy_count;
      }
    }
    that.setData({
      buycount: count,
      totalprice: totalprice.toFixed(2)
    })
    wx.setStorageSync('car_count', count);
  },
  changeProductCount: function(product_id, count) {
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/update_cart_product_count?product_id=' + product_id + '&product_count=' + count,
      header: {
        s: app.globalData.userInfo.session
      },
      method: 'POST',
      complete: function(res) {
        console.log(res);
      }
    })
  },
  deleteProduct: function(items, product_ids) {
    var that = this;
    var itemcount = util.getHsonLength(items);
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/delete_cart_product?product_ids=' + product_ids,
      header: {
        s: app.globalData.userInfo.session
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除成功',
          })
          if (itemcount > 0) {
            that.setData({
              list: items
            })
          } else {
            that.setData({
              list: null
            })
          }
          that.changePrice(items);
        }
      }
    })
  }
})