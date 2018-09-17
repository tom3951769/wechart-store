// pages/realnameauthentication/realnameauthentication.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{ id: '0', name: '刘艳', phonecode: '41142199109093388', address: '湖北省武汉市洪山区保安一期301', isdefullt: true, isShowline: true, isSeleted: true ,isAddress:false},
      { id: '1', name: '张三', phonecode: '41142199109093388', address: '湖北省武汉市洪山区保安一期301', isdefullt: false, isShowline: true, isSeleted: false }
    ],
  
  },
  toAddrealnameauthetication:function()
  {
     wx.navigateTo({
       url: '/pages/addrealnameauthentication/addrealnameauthentication',
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})