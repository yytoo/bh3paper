const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息  
function isError(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        wx.redirectTo({
          url: '../supply/supply',
        })
      }
    },
    fail: function (res) {
      wx.redirectTo({
        url: '../supply/supply',
      })
    }
  })
}
//顶端提示
function warnTitle(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  })
}

//提示系统繁忙
function showBusyModal(toUrl){
  wx.showModal({
    showCancel: false,
    title: '提示',
    content: '系统繁忙，请稍后再试',
    success: function (res) {
      if (res.confirm) {
        wx.redirectTo({
          url: toUrl,
        })
      }
    },
    fail: function (res) {
      wx.redirectTo({
        url: '../supply/supply',
      })
    }
  })
}

//request请求form,其中module.exports是将req方法暴露出去使得别的文件中可以使用该方法，由于js函数是异步执行的，所以return 的是回调函数，而不是具体的数据
var rootDocment = 'http//192.168.1.104:8080';
function req(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}



module.exports = {
  formatTime: formatTime,
  trim: trim,
  isError: isError,
  req: req,
 
}
