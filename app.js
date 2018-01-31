//app.js
App({
  onLaunch: function () {
    var that = this;
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          that.globalData.logCode = res.code;

          //获取openid
          wx.request({
            url: that.globalData.url + "/api/WxOpenLogin/Openid/" + that.globalData.logCode,
            method: 'GET',
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              if (res.data.status) {
                that.globalData.openId = res.data.value;   
              } else {
                isError("微信登录失败，请稍后再试");
              }

            },
            fail: function (res) {
              isError("微信登录失败，请稍后再试");
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

    // 提示错误信息  
    function isError(msg) {
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    logCode: null,
    url: 'https://gamepaper.cn',
    openId: "",
    id:"",
    username:"",
    nickname:"",
  },

})

