const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/* 毫秒级秒杀倒计时 */
function countdown(total_micro_second, json, that) {
  dateformat(total_micro_second, json) //格式化时间
  that.setData({
    list: json,
  })
  if (total_micro_second <= 0) {
    // timeout则跳出递归
    return;
  }

  //settimeout实现倒计时效果
  setTimeout(function() {
    // 放在最后--
    total_micro_second -= 1000;
    countdown(total_micro_second, json, that);
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

function timestamptodate(timestamp) {
  // 总秒数
  var second = Math.floor(timestamp / 1000);
  // // 天数
  // var day = Math.floor(second / 3600 / 24);
  // 总小时
  var hr = Math.floor(second / 3600);
  // 小时位
  var hr2 = hr % 24;
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  // var micro_sec = Math.floor((micro_second % 1000) / 10);
  return hr2 + ':' + min + ':' + sec
}

//获取JSON数组的长度
function getHsonLength(json) {
  var jsonLength = 0;
  for (var i in json) {
    jsonLength++;
  }
  return jsonLength;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function login() {
  return new Promise(function(resolve, reject) {
    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        if (code != null) {
          //接口登陆
          wx.request({
            url: 'https://efreshness.cn/overseas_server_test/mp/user_login?code=' + code,
            method: 'POST',
            success: function (e) {
              //登陆成功
              if (e.data.code == 0) {
                let result = e.data;
                resolve(result);
              }
            },
            fail: function (e) {
              reject("系统异常，请重试！");
            }
          })
        }
      }
    })
  })
}
// 去前后空格
function trimComma(str) {
  return str.replace(/(^,*)|(,*$)/g, "");
}

function formatTimestamp(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

module.exports = {
  formatTime: formatTime,
  getHsonLength: getHsonLength,
  login: login,
  countdown: countdown,
  dateformat: dateformat,
  timestamptodate: timestamptodate,
  trimComma: trimComma,
  formatTimestamp: formatTimestamp,
}