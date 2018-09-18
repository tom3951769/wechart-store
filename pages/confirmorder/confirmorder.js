// pages/confirmorder/confirmorder.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    json: null,
    couponlist: null,
    isshowcoupon: false,
    voucherlist: null,
    isshowvoucher: false,
    order_info: null,
    isRedact: false,
    coupontext: '不使用优惠卷',
    coupon_money: 0,
    vouchertext: '分享有礼-好友下单立享代金卷',
    voucher_money: 0,
    discount: 0,
    total_price: 0,
    coupon_code: null,
    cash_coupon_code: null,
    isuse_coupon: true,
    isuse_cach_coupon: true,
    help_id:null,
  },
  immeBuy: function(e) {
    var that = this
    var help_id = that.data.help_id
    var address_id = that.data.json.address_id
    if (help_id != null && address_id!=null)
    {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/bare_order_submit?help_id=' + help_id + '&address_id=' + address_id,
        header: {
          s: app.globalData.userInfo.session
        },
        method: 'POST',
        success(res) {
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '/pages/pay/pay?json=' + JSON.stringify(res.data),
            })
          }
        }
      })
      return
    }
    if (that.data.coupon_code != null && that.data.cash_coupon_code == null) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/order_submit',
        header: {
          s: app.globalData.userInfo.session,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          order_info: that.data.order_info,
          total_price: that.data.json.total_price,
          product_price: that.data.json.product_price,
          coupon_code: that.data.coupon_code,
          discount: that.data.discount,
          freight: that.data.json.freight,
          address_id: that.data.json.address_id,
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '/pages/pay/pay?json=' + JSON.stringify(res.data),
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提交失败,失败原因：' + res.data.msg,
            })
          }
        }
      })
    } else if (that.data.coupon_code == null && that.data.cash_coupon_code != null) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/order_submit',
        header: {
          s: app.globalData.userInfo.session,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          order_info: that.data.order_info,
          total_price: that.data.json.total_price,
          product_price: that.data.json.product_price,
          cash_coupon_code: that.data.cash_coupon_code,
          discount: that.data.discount,
          freight: that.data.json.freight,
          address_id: that.data.json.address_id,
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '/pages/pay/pay?json=' + JSON.stringify(res.data),
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提交失败,失败原因：' + res.data.msg,
            })
          }
        }
      })
    } else if (that.data.coupon_code == null && that.data.cash_coupon_code == null) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/order_submit',
        header: {
          s: app.globalData.userInfo.session,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          order_info: that.data.order_info,
          total_price: that.data.json.total_price,
          product_price: that.data.json.product_price,
          discount: that.data.discount,
          freight: that.data.json.freight,
          address_id: that.data.json.address_id,
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '/pages/pay/pay?json=' + JSON.stringify(res.data),
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提交失败,失败原因：' + res.data.msg,
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '优惠卷跟代金卷不能同时使用',
      })
    }
  },
  onIsUse(e) {
    var that = this
    var items = e.detail.items
    var isuse = e.detail.isuse
    var typenumber = parseInt(e.detail.typenumber)
    var list = items.filter((item) => {
      item.ischecked = false
      return item;
    })
    if (typenumber == 1) {
      if (isuse) {
        that.setData({
          isuse_coupon: false
        })
      } else {
        that.setData({
          isuse_coupon: true,
          couponlist: list,
          coupon_money: 0,
          coupontext: '不使用优惠卷',
        })
      }
    } else {
      if (isuse) {
        that.setData({
          isuse_cach_coupon: false
        })
      } else {
        that.setData({
          isuse_cach_coupon: true,
          voucherlist: list,
          voucher_money: 0,
          vouchertext: '不使用代金卷',
        })
      }
    }
  },
  onAffirm(e) {
    var that = this
    that.setData({
      isshowcoupon: false,
      isshowvoucher: false,
      isRedact: false,
    })
    var discount = that.data.voucher_money + that.data.coupon_money
    that.setData({
      discount: discount,
    })
    var isCoupon = false
    var isCash_coupon = false
    that.data.couponlist.map((item) => {
      if (item.ischecked) {
        isCoupon = true
        that.setData({
          coupon_code: item.coupon_code
        })
      }
    })
    if (isCoupon == false) {
      that.setData({
        coupon_code: null,
      })
    }
    var cach_coupon_String = ''
    that.data.voucherlist.map((item) => {
      if (item.ischecked) {
        isCash_coupon = true
        cach_coupon_String += item.coupon_code + ','
      }
    })
    that.setData({
      cash_coupon_code: util.trimComma(cach_coupon_String)
    })
    if (isCash_coupon == false) {
      that.setData({
        cash_coupon_code: null,
      })
    }
  },
  onSeletedCoupon(e) {
    var that = this
    var money = parseInt(e.detail.item.coupon_money)
    var coupon_code = e.detail.item.coupon_code
    var typenumber = parseInt(e.detail.typenumber)
    if (typenumber == 1) {
      var list = that.data.couponlist.filter((item) => {
        if (item.coupon_code == coupon_code) {
          if (item.ischecked) {
            item.ischecked = false
            that.setData({
              coupon_money: 0,
              coupontext: '不使用优惠卷',
            })
          } else {
            item.ischecked = true
            that.setData({
              coupon_money: money,
              coupontext: '已选择' + money + '元优惠卷',
              isuse_coupon: false,
            })

          }
          if (that.data.voucher_money > 0) {
            wx.showModal({
              title: '提示',
              content: '优惠卷跟代金卷只能选择一种！',
            })
            that.data.voucher_money = 0
            that.setData({
              vouchertext: '分享有礼-好友下单立享代金卷',
              voucher_money: 0,
            })
          }
        } else {
          item.ischecked = false
        }
        return item
      })
      that.setData({
        couponlist: list
      })
    }
    if (typenumber == 2) {
      var voucher_money = 0
      var list = that.data.voucherlist.filter((item) => {
        if (item.coupon_code == coupon_code) {
          if (item.ischecked) {
            item.ischecked = false
          } else {
            item.ischecked = true
            that.setData({
              isuse_cach_coupon: false,
            })
          }
          if (that.data.coupon_money > 0) {
            wx.showModal({
              title: '提示',
              content: '优惠卷跟代金卷只能选择一种！',
            })
            that.data.coupon_money = 0
            that.setData({
              coupontext: '不使用优惠卷',
              coupon_money: 0,
            })
          }
        }
        if (item.ischecked) {
          voucher_money = (voucher_money + parseInt(item.coupon_money))
        }
        return item
      })
      if (voucher_money == 0) {
        that.setData({
          voucherlist: list,
          voucher_money: voucher_money,
          vouchertext: '不使用代金卷',
        })
      } else {
        that.setData({
          voucherlist: list,
          voucher_money: voucher_money,
          vouchertext: '已选择' + voucher_money + '元代金卷',
        })
      }
    }
    // var discount = that.data.voucher_money + that.data.coupon_money
    // that.data.json.total_price = parseFloat(that.data.json.total_price) - discount
    // that.setData({
    //   discount: discount,
    //   json: that.data.json
    // })
  },
  showCoupon(e) {
    this.setData({
      isshowcoupon: true,
      isRedact: true,
    })
  },
  showVoucher(e) {
    this.setData({
      isshowvoucher: true,
      isRedact: true,
    })
  },
  toAddressAdd(e) {
    wx.navigateTo({
      url: '/pages/addshippingaddress/addshippingaddress',
    })
  },
  getCoupon(order_info) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_valid_coupon_list',
      header: {
        s: app.globalData.userInfo.session,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        order_info: order_info
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 0) {
          var list = res.data.list.filter((item) => {
            item.ischecked = false
            return item
          })
          that.setData({
            couponlist: list
          })
        }
      }
    })
  },
  getVoucher(order_info) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_valid_cash_coupon_list',
      header: {
        s: app.globalData.userInfo.session,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        order_info: order_info
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 0) {
          var list = res.data.list.filter((item) => {
            item.ischecked = false
            return item
          })
          that.setData({
            voucherlist: list
          })
        }
      }
    })
  },
  getOrder(order_info) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/add_to_confirm_order',
      header: {
        s: app.globalData.userInfo.session,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        order_info: order_info
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 0) {
          res.data.isdefult = true
          that.setData({
            json: res.data
          })
        }
      }
    })
  },
  gethelpOrder(help_id) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/add_to_confirm_bare_order?help_id=' + help_id,
      header: {
        s: app.globalData.userInfo.session
      },
      method:'POST',
      success(res) {
        if (res.data.code == 0) {
          var order_info = {
            "order_list": []
          }
          for (var index in res.data.product_list) {
            var product = {
              "product_id": (res.data.product_list[index].product_id).toString(),
              "total_count": parseInt(res.data.product_list[index].product_count),
              "total_price": res.data.product_list[index].product_count * parseFloat(res.data.product_list[index].price).toFixed(2),
            }
            order_info.order_list.push(product)
          }
          that.setData({
            json: res.data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.order_info != null) {
        this.getOrder(options.order_info)
        this.getCoupon(options.order_info)
        this.getVoucher(options.order_info)
        this.data.order_info = options.order_info
      }
      if (options.help_id != null) {
        this.setData(
          {
            help_id: options.help_id
          }
        )
        this.gethelpOrder(options.help_id)
      }
    }
  },
  onSelectedAddress(e)
  {
    wx.navigateTo({
      url: '/pages/myshippingaddress/myshippingaddress?address_json=' + JSON.stringify(this.data.json),
    })
  }
  ,
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