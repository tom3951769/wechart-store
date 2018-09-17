//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    
    if (this.globalData == null || this.globalData.userInfo == null) {
      util.login().then((res) => {
        this.globalData.userInfo = res;
        wx.setStorageSync('car_count', res.cart_product_count);
      }).catch((res) => {
        console.log('登陆失败')
      });
    }

  },
  globalData: {
    userInfo: null,
    appid: 'wx593fa43fe13d9ea1',//appid需自己提供，此处的appid我随机编写
    secret: '4959be0f753df1503271787746f6ef29',//secret需自己提供，此处的secret我随机编写
  }
})