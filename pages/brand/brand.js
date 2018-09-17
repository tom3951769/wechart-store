// pages/brand/brand.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentcount: 0,
    totalcount: 0,
    loadcount: 6,
    list: null,
    follow_status: 0,
  },
  getBrandlist(brand_id) {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_brand_index_data?brand_id=' + brand_id,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          wx.setNavigationBarTitle({
            title: res.data.brand_name,
          })
          that.setData({
            list: res.data,
            follow_status: res.data.follow_status,
            currentcount: res.data.page_size * res.data.cur_page,
            totalcount: res.data.total_page * res.data.page_size
          })
        }
      }
    })
  },
  addLike(e) {
    var that = this;
    var toUrl = '';
    var title = '';
    var flag = 0;
    if (that.data.follow_status == 0) {
      toUrl = 'https://efreshness.cn/overseas_server_test/mp/follow_brand_submit'
      title = '关注成功';
      flag = 1;
    } else {
      toUrl = 'https://efreshness.cn/overseas_server_test/mp/unfollow_brand_submit'
      title = '取消关注';
      flag = 0;
    }
    wx.request({
      url: toUrl + '?brand_id=' + e.target.dataset.item.brand_Id,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({
            follow_status: flag
          })
          wx.showToast({
            title: title,
          })
        } else {
          wx.showToast({
            title: title + '失败',
          })
        }
      },
      fail(e) {
        wx.showToast({
          title: '关注失败，系统错误',
        })
        console.log(e);
      }
    })
  },
  onClick: function(e) {
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + e.detail.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.brand_id != null) {
        var brand_id = options.brand_id
        this.getBrandlist(brand_id);
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