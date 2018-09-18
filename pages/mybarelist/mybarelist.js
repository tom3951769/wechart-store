// pages/mybarelist/mybarelist.js

/* 毫秒级秒杀倒计时 */
function countdown(total_micro_second, json, list, that) {
  dateformat(total_micro_second, json) //格式化时间
  that.setData({
    list: list
  })
  if (total_micro_second <= 0) {
    // timeout则跳出递归
    return;
  }
  //settimeout实现倒计时效果
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 1000;
    countdown(total_micro_second, json, list, that);
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
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    currentcount: 0,
    totalcount: 0,
    loadcount: 6,
  },
  getdata(cur_page, page_size, load_type) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_my_barehelp_list?cur_page=' + cur_page + '&page_size=' + page_size,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          var list = res.data.list.filter((item) => {
            var now = new Date();
            var total_micro_second = item.failure_time - now;
            var totalpage = res.data.total_page;
            countdown(total_micro_second, item, res.data.list, that);
            return item;
          })
          if (load_type == 1) {
            for (var index in list) {
              that.data.list.push(list[index])
            }
          } else {
            that.data.list = list
          }
          that.setData({
            list: that.data.list,
            currentcount: cur_page * page_size,
            totalcount: res.data.total_page * page_size,
          })
        }
      }
    })
  },
  goMybare(e)
  {
    var product_id = e.currentTarget.dataset.item.product_id 
    wx.navigateTo({
      url: '/pages/mybare/mybare?id=' + product_id,
    })
  },
  goPayTap(e)
  {
    var help_id = e.currentTarget.dataset.item.help_id
    wx.navigateTo({
      url: '/pages/confirmorder/confirmorder?help_id=' + help_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getdata(1, this.data.loadcount, 0)
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
    var that = this
    var loadcount = that.data.loadcount;
    var totalcount = that.data.totalcount;
    var currentcount = that.data.currentcount;
    if (currentcount < totalcount) {
      var pageindex = parseInt(((loadcount + currentcount) / loadcount));
      this.getdata(pageindex, loadcount, 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    var that = this
    var help_id = e.target.dataset.item.help_id
    var status = e.target.dataset.item.status
    if (status == -99) {
      wx.request({
        url: 'https://efreshness.cn/overseas_server_test/mp/activate_barehelp?help_id=' + help_id,
        header: {
          s: app.globalData.userInfo.session
        },
        success(res) {
          if (res.data.code == 0) {
            that.getdata(that.data.product_id)
            return {
              title: "快来帮助" + app.globalData.userInfo.nickname + "助力购啦",
              imageUrl: e.target.dataset.item.product_img,
              path: "/pages/bare/bare?id=" + e.target.dataset.item.help_id
            }
          }
        }
      })
    }
    else
    {
      return {
        title: "快来帮助" + app.globalData.userInfo.nickname + "助力购啦",
        imageUrl: e.target.dataset.item.product_img,
        path: "/pages/bare/bare?id=" + e.target.dataset.item.help_id
      }
    }
  }
})