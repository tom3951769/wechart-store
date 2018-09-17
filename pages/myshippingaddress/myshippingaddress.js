// pages/myshippingaddress/myshippingaddress.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address_json: null,
    list: [],
  },
  toAddToShoppingAddress: function(e) {
    wx.navigateTo({
      url: '/pages/addshippingaddress/addshippingaddress',
    })
  },
  seletedAddress(e) {
    var that = this
    var address_json = that.data.address_json
    if (address_json != null) {
      var id = e.detail.id
      var isDefult = e.detail.item.is_default == 1 ? true : false
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1]
      var lastPage = pages[pages.length - 2]
      that.data.list.map((item) => {
        if (item.address_id == id) {
          address_json.address_id = item.address_id
          address_json.isdefult = isDefult
          address_json.contacts = item.contacts
          address_json.mobile = item.mobile
          address_json.address = item.full_address
          address_json.contacts_id_num = item.contacts_id_num
        }
      })
      lastPage.setData({
        json: address_json
      })
      wx.navigateBack();
    }
  },
  redactAddress(e) {
    var isDefult = e.detail.item.is_default == 1 ? true : false
    var contacts_id_num = e.detail.item.contacts_id_num
    wx.navigateTo({
      url: '/pages/addshippingaddress/addshippingaddress?address_id=' + e.detail.id + '&isDefult=' + isDefult + '&contacts_id_num=' + contacts_id_num,
    })
  },
  removeAddress(e) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/delete_address?address_id=' + e.detail.id,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          var list = that.data.list.filter((item) => {
            return item.address_id != e.detail.id
          })
          that.setData({
            list: list
          })
          wx.showToast({
            title: '删除成功',
          })
        } else {
          wx.showToast({
            title: '删除失败',
          })
        }
      }
    })
  },
  setDefultAddress(e) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/default_address?address_id=' + e.detail.id,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          that.data.list.map((item) => {
            if (item.address_id == e.detail.id) {
              item.is_default = 1
            } else {
              item.is_default = 0
            }
          })
          that.setData({
            list: that.data.list
          })
          wx.showToast({
            title: '设置成功',
          })
        } else {
          wx.showToast({
            title: '设置失败',
          })
        }
      }
    })
  },
  getAddress() {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_address_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          var list = res.data.list.filter((item) => {
            item.isSeleted = false;
            item.isShowline = true;
            return item;
          })
          that.setData({
            list: list
          })
        }
      }
    })
  },
  getlist() {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_province_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {

        }
      }
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_city_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {

        }
      }
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_area_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.address_json != null) {
        this.setData({
          address_json: JSON.parse(options.address_json)
        })
      }
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
    this.getAddress()
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