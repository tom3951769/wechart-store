// pages/search/search.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入的搜索关键字
    search_word_input: null,
    //搜索默认关键字
    search_word: '探索你的精致养娃生活',
    //搜索热门关键字集合
    search_wordlist: [{
        keyword: 'Kenzo'
      },
      {
        keyword: 'Hape'
      },
      {
        keyword: '保温瓶'
      },
      {
        keyword: 'Baby Toys'
      },
      {
        keyword: '益智玩具'
      },
      {
        keyword: '音乐启蒙'
      },
    ],
    search_hot_wordlist: [],
  },
  searchinput: function(e) {
    this.setData({
      search_word_input: e.detail.value
    })
  },
  deleteSearchHotWord(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要清空最近搜索记录?',
      success(res) {
        if (res.confirm) {
          wx.setStorageSync('search_hot_wordlist', '');
          that.setData({
            search_hot_wordlist: ''
          })
        }
      }
    })
  },
  toClassify: function(e) {
    wx.navigateTo({
      url: '/pages/classify/classify?keyword=' + e.currentTarget.dataset.value,
    })
    var search_hot_wordlist = wx.getStorageSync('search_hot_wordlist')
    var length = util.getHsonLength(search_hot_wordlist)
    if (length == 0) {
      search_hot_wordlist = []
      search_hot_wordlist[0] = {
        keyword: e.currentTarget.dataset.value
      }
    } else {
      search_hot_wordlist[length] = {
        keyword: e.currentTarget.dataset.value
      }
    }
    wx.setStorageSync('search_hot_wordlist', search_hot_wordlist)
    this.setData({
      search_hot_wordlist: search_hot_wordlist
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options != null) {
      if (options.searchword != null) {
        that.setData({
          search_word: options.searchword
        })
      } else {
        var search_word = wx.getStorageSync('search_word');
        that.setData({
          search_word: search_word
        })
      }
    }

    that.getsearchwordlist();
  },
  getsearchwordlist: function() {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_hot_keyword_list',
      header: {
        s: app.globalData.userInfo.session
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            search_wordlist: res.data.list
          })
        }
      }
    })
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
    var that = this
    var search_hot_wordlist = wx.getStorageSync('search_hot_wordlist')
    that.setData({
      search_hot_wordlist: search_hot_wordlist
    })
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