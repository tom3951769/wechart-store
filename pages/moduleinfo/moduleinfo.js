var rate = 0; //分辨转换
var floatTop = 0; //悬浮高度
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    curTabId: "0",
    currentcount: 0,
    totalcount: 0,
    loadcount: 6,
    title: '模块页面',
    type_number: 0,
    type_id: null,
    category_id: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != null) {
      if (options.banner_id != null) {
        var banner_id = options.banner_id;
        this.data.type_number = 0
        this.data.type_id = banner_id
        this.query_banner_product_list(banner_id);
      }
      if (options.category_id != null) {
        var category_id = options.category_id;
        this.data.type_number = 1
        this.data.type_id = category_id
        this.query_category_product_list(category_id, 1, 1, 1, this.data.loadcount, 0);
      }
      if (options.item != null) {
        var item = JSON.parse(options.item)
        var category_id = item.category_id;
        var module_id = item.module_id;
        var title = item.module_name;

        wx.setNavigationBarTitle({
          title: title //页面标题为路由参数
        })

        this.data.type_number = 2
        this.data.type_id = module_id
        this.query_recomm_module_product_list(category_id, module_id, 1, this.data.loadcount, 0);
      }
    }
  },
  query_recomm_module_product_list(category_id, module_id, cur_page, page_size, load_type) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var urlString = ''
    if (category_id != null) {
      that.setData({
        category_id: category_id
      })
      urlString = 'https://efreshness.cn/overseas_server_test/mp/query_recomm_module_product_list?category_id=' + category_id + '&module_id=' + module_id + '&cur_page=' + cur_page + '&page_size=' + page_size
    } else {
      urlString = 'https://efreshness.cn/overseas_server_test/mp/query_recomm_module_product_list?module_id=' + module_id + '&cur_page=' + cur_page + '&page_size=' + page_size
    }
    wx.request({
      url: urlString,
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          if (load_type == 1) {
            for (var item in res.data.list) {
              that.data.list.push(res.data.list[item]);
            }
          } else {
            that.data.list = res.data.list;
          }
          that.setData({
            list: that.data.list,
            totalcount: res.data.total_page * that.data.loadcount,
            currentcount: cur_page * that.data.loadcount
          })
        }
      }
    })
  },
  query_category_product_list(id, sort_field, sort_type, cur_page, page_size, load_type) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_category_product_list?category_id=' + id + '&sort_field=' + sort_field + '&sort_type=' + sort_type + '&cur_page=' + cur_page + '&page_size=' + page_size,
      success(res) {
        if (res.data.code == 0) {
          wx.hideLoading();
          wx.setNavigationBarTitle({
            title: res.data.category_name //页面标题为路由参数
          })
          if (load_type == 1) {
            for (var item in res.data.list) {
              that.data.list.push(res.data.list[item]);
            }
          } else {
            that.data.list = res.data.list;
          }
          that.setData({
            list: that.data.list,
            title: res.data.category_name,
            totalcount: res.data.total_page * that.data.loadcount,
            currentcount: cur_page * that.data.loadcount
          })
        }
      }
    })
  },
  query_banner_product_list(id) {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_banner_product_list?banner_id=' + id,
      success(res) {
        if (res.data.code == 0) {
          wx.setNavigationBarTitle({
            title: res.data.banner_title //页面标题为路由参数
          })
          that.setData({
            list: res.data.list
          })
        }
      }
    })
  },
  onClick: function(e) {
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + e.detail.id,
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
  onScrolltolower: function() {
    var that = this;
    var loadcount = that.data.loadcount;
    var totalcount = that.data.totalcount;
    var currentcount = that.data.currentcount;
    var category_id = that.data.category_id;
    var type_id = that.data.type_id;
    var type_number = that.data.type_number;
    if (currentcount < totalcount) {

      var pageindex = parseInt(((loadcount + currentcount) / loadcount));
      if (type_number == 0) {

      } else if (type_number == 1) {
        that.query_category_product_list(type_id, 1, 1, pageindex, loadcount, 1);
      } else {
        this.query_recomm_module_product_list(category_id, type_id, pageindex, this.data.loadcount, 1);
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.onScrolltolower();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})