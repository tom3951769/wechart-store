//index.js
var showcategory = [false];
/* 毫秒级秒杀倒计时 */
function countdown(total_micro_second, json, that, flashsale_module_list) {
  dateformat(total_micro_second, json) //格式化时间
  that.setData({
    flashsale_module_list: flashsale_module_list
  })
  if (total_micro_second <= 0) {
    // timeout则跳出递归
    return;
  }
  //settimeout实现倒计时效果
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 1000;
    countdown(total_micro_second, json, that, flashsale_module_list);
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

//获取应用实例
const app = getApp();
Page({
  data: {
    //轮播图商品
    banner_list: null,
    //标语
    slogan_list: null,
    //最新上架商品
    newest_module: null,
    //一级类目列表
    category_list: null,
    //秒杀列表
    flashsale_module_list: null,
    //推荐模块
    recomm_module_list: null,
    //品牌模块
    brand_module_list: null,
    brand_list: null,
    //分类栏目是否隐藏
    bottom_category_show: showcategory,
    //底部分类模块
    bottom_category_list: null,
    //搜索栏默认搜索条件
    searchword: '搜索你的精致养娃生活',
    //秒杀模块当前index
    seckillindex:0,
    //推荐模块当前tab
    currentTab: 0,
  },
  toBrand(e) {
    wx.navigateTo({
      url: '/pages/brand/brand?brand_id=' + e.currentTarget.dataset.item.brand_id,
    })
  },
  toClassify: function(e) {
    wx.navigateTo({
      url: '/pages/classify/classify?keyword=' + this.data.searchword,
    })
  },
  toCategoryinfo(e) {
    wx.navigateTo({
      url: '/pages/indextowleveldirectory/indextowleveldirectory?category_id=' + e.currentTarget.dataset.items.category_id + '&title=' + e.currentTarget.dataset.items.category_name,
    })
  },
  toCategoryinfoitem(e) {
     wx.navigateTo({
       url: '/pages/moduleinfo/moduleinfo?category_id=' + e.currentTarget.dataset.items.category_id,
    })
  },
  toBannerinfo(e) {
    wx.navigateTo({
      url: '/pages/moduleinfo/moduleinfo?banner_id=' + e.currentTarget.dataset.items.banner_id,
    })
  },
  toModuleinfoItem(e) {
    wx.navigateTo({
      url: '/pages/indextowleveldirectory/indextowleveldirectory?category_id=' + e.currentTarget.dataset.items.module_id + '&title=' + e.currentTarget.dataset.items.module_name,
    })
  },
  toModuleinfo(e) {
    wx.navigateTo({
      url: '/pages/moduleinfo/moduleinfo?item=' + JSON.stringify(e.currentTarget.dataset.items)
    })
  },
  loadindexdata: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_index_data',
      success: function(res) {
        if (res != null) {
          //请求成功
          if (res.data.code == 0) {
            wx.hideLoading();
            //遍历秒杀模块的商品
            for (var flashsale_index in res.data.flashsale_module_list) {
              for (var index in res.data.flashsale_module_list[flashsale_index].product_list) {
                var startdate = res.data.flashsale_module_list[flashsale_index].start_date;
                var enddate = res.data.flashsale_module_list[flashsale_index].end_date;
                var total_micro_second = enddate - startdate;
                countdown(total_micro_second, res.data.flashsale_module_list[flashsale_index].product_list[index], that, res.data.flashsale_module_list);
              }
            }
            var search_word = res.data.search_word;
            wx.setStorageSync('search_word', search_word);
            that.setData({
              searchword: search_word,
              banner_list: res.data.banner_list,
              slogan_list: res.data.slogan_list,
              newest_module: res.data.newest_module,
              category_list: res.data.category_list,
              flashsale_module_list: res.data.flashsale_module_list,
              recomm_module_list: res.data.recomm_module_list,
              bottom_category_list: res.data.bottom_category_list,
              brand_module_list: res.data.brand_module_list,
              brand_list: res.data.brand_module_list[0].brand_list
            })
          }
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '加载首页失败',
          icon: 'none'
        })
        console.log(res);
      }
    })
  },
  toNextDirectory: function() {
    wx.navigateTo({
      url: '/pages/indextowleveldirectory/indextowleveldirectory',
    })
  },
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search?searchword=' + this.data.searchword,
    })
  },
  nextSeckill: function(e) {
    var that = this;
    var index = that.data.seckillindex;
    var flashsale_module_index = e.currentTarget.dataset.items;
    if (index < (this.data.flashsale_module_list[flashsale_module_index].product_list.length - 1)) {
      that.setData({
        seckillindex: index + 1
      })
    } else {
      that.setData({
        seckillindex: 0
      })
    }
  },
  onLoad: function() {
    this.loadindexdata();
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  toCommoinfo: function(e) {
    wx.navigateTo({
      url: '/pages/commodityinfo/commodityinfo?id=' + e.currentTarget.dataset.items.product_id,
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
        currentTab: e.target.dataset.current
      })
    }
  },
  classifyhide: function(e) {
    var that = this;
    var itemId = e.currentTarget.id;
    var param = "bottom_category_show[" + itemId + "]";
    if (that.data.bottom_category_show[itemId] == true) {
      that.setData({
        [param]: false
      })
    } else {
      that.setData({
        [param]: true
      })
    }
  },
  toSeckill: function(res) {
    wx.navigateTo({
      url: '/pages/seckill/seckill?module_id=' + res.currentTarget.dataset.items.module_id + '&title=' + res.currentTarget.dataset.items.module_name,
    })
  },

})