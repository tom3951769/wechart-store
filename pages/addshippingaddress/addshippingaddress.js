var app = getApp();

var area = require('../../utils/area.js')

var areaInfo = []; //所有省市区县数据

var provinces = []; //省

var citys = []; //城市

var countys = []; //区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;


//动画事件
function animationEvents(that, moveY, show) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province_name: '',
    city_name: '',
    area_name: '',
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = {
      name: ''
    };
  }

  that.setData({
    city_name: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = {
      name: ''
    };
  }
  that.setData({
    area_name: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    address_id: '',
    province_id: null,
    city_id: null,
    area_id: null,
    province_name: '',
    city_name: '',
    area_name: '',
    contacts: '',
    mobile: '',
    address: '',
    contacts_id_num: '',
    isDefult: false,
    settingbutton: [{
        id: '0',
        nodeName: '收货人姓名',
        navigateUrl: ''
      },
      {
        id: '4',
        nodeName: '身份证号码',
        navigateUrl: ''
      },
      {
        id: '1',
        nodeName: '手机号码',
        navigateUrl: '',
        phonecode: '13213188251'
      },
      {
        id: '2',
        nodeName: '省市区',
        navigateUrl: '/pages/myshippingaddress/myshippingaddress'
      },
      {
        id: '3',
        nodeName: '详细地址',
        navigateUrl: '/pages/myshippingaddress/myshippingaddress'
      },
    ],
    settingbutton1: [{
      id: '0',
      nodeName: '设置为默认地址',
      navigateUrl: ''
    }, ]
  },
  //滑动事件
  bindChange: function(e) {
    var val = e.detail.value
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this); //获取地级市数据
      getCountyInfo(val[0], val[1], this); //获取区县数据
    } else { //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this); //获取区县数据
      }
    }
    index = val;
    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province_name: provinces[val[0]].name,
      city_name: citys[val[1]].name,
      area_name: countys[val[2]].name,
      province_id: provinces[val[0]].code,
      city_id: citys[val[1]].code,
      area_id: countys[val[2]].code,
    })

  },
  //移动按钮点击事件
  translate: function(e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    animationEvents(this, moveY, show);

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
  },
  formSubmit: function(e) {
    if (e.detail.value.name.length == 0 || e.detail.value.phonecode.length == 0 || e.detail.value.fulladdress.length == 0 || e.detail.value.address.length == 0 || e.detail.value.contacts_id_num.length == 0) {
      wx.showToast({
        title: '必填项不能未空!',
        icon: 'loading',
      })
      return
    }
    if (e.detail.value.phonecode.length != 11) {
      wx.showToast({
        title: '请输入11位手机号码!',
      })
      return
    }
    var contacts = e.detail.value.name;
    var mobile = e.detail.value.phonecode;
    var province_id = this.data.province_id;
    var city_id = this.data.city_id;
    var area_id = this.data.area_id;
    var address = e.detail.value.address;
    var identity_num = e.detail.value.contacts_id_num;
    if (this.data.address_id != '') {
      this.updateAddress(this.data.address_id, contacts, mobile, province_id, city_id, area_id, address, identity_num)
    } else {
      this.addAddress(contacts, mobile, province_id, city_id, area_id, address, identity_num)
    }
  },
  updateAddress(address_id, contacts, mobile, province_id, city_id, area_id, address, identity_num) {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/update_address?address_id=' + address_id + '&contacts=' + contacts + '&mobile=' + mobile + '&province_id=' + province_id + '&city_id=' + city_id + '&area_id=' + area_id + '&address=' + address,
      header: {
        s: app.globalData.userInfo.session
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 0) {
          wx.request({
            url: 'https://efreshness.cn/overseas_server_test/mp/auth_consumer_address?address_id=' + address_id + '&identity_num=' + identity_num,
            header: {
              s: app.globalData.userInfo.session,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success(res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '保存成功',
                })
                wx.navigateTo({
                  url: '/pages/myshippingaddress/myshippingaddress',
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '保存失败',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '保存失败,系统错误',
        })
      }
    })
  },
  addAddress(contacts, mobile, province_id, city_id, area_id, address, identity_num) {
    var that = this;
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/add_address?contacts=' + contacts + '&mobile=' + mobile + '&province_id=' + province_id + '&city_id=' + city_id + '&area_id=' + area_id + '&address=' + address,
      header: {
        s: app.globalData.userInfo.session,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 0) {
          var address_id = res.data.address_id
          if (address_id != null) {
            wx.request({
              url: 'https://efreshness.cn/overseas_server_test/mp/auth_consumer_address?address_id=' + address_id + '&identity_num=' + identity_num,
              header: {
                s: app.globalData.userInfo.session,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success(res) {
                if (res.data.code == 0) {
                  wx.showToast({
                    title: '保存成功',
                  })
                  wx.navigateTo({
                    url: '/pages/myshippingaddress/myshippingaddress',
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
        })
      }
    })
  },
  toNavigateUrl: function(e) {
    var navigateUrl = e.currentTarget.dataset.items.id;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options != null) {
      if (options.address_id != null && options.isDefult != null) {
        var address_id = options.address_id
        var isDefult = options.isDefult == 'false' ? false : true
        var contacts_id_num = ''
        if (options.contacts_id_num != null) {
          contacts_id_num = options.contacts_id_num
        }
        this.setData({
          isDefult: isDefult,
          address_id: address_id,
          contacts_id_num: contacts_id_num,
        })
        this.getAddress(address_id);
      }
    }

    //获取省市区县数据
    area.getAreaInfo(function(arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });
  },
  getAddress(address_id) {
    var that = this
    wx.request({
      url: 'https://efreshness.cn/overseas_server_test/mp/query_address_detail?address_id=' + address_id,
      header: {
        s: app.globalData.userInfo.session
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({
            contacts: res.data.contacts,
            mobile: res.data.mobile,
            province_name: res.data.province_name,
            city_name: res.data.city_name,
            area_name: res.data.area_name,
            province_id: res.data.province_id,
            city_id: res.data.city_id,
            area_id: res.data.area_id,
            address: res.data.address,
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
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