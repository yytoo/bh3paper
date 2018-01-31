//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {},
onLoad:function(){
 
    //获取openid成功后，获取该用户id
    wx.login({
      success: function (res) {
        wx.request({
          url: app.globalData.url + "/api/WxOpenLogin/User/" + res.code,
          method: 'GET',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data.status) {
              app.globalData.id = res.data.value.id;
              app.globalData.username = res.data.value.username;
              app.globalData.nickname = res.data.value.nickName;
              util.isError("你好！" + res.data.value.nickName);
            } else {
              util.isError("您尚未注册，请注册" );
              console.log(res.data);
            }
          },
          fail: function (res) {
            util.isError("用户登录失败，请稍后再试");
          }
        })
      }
    })
},
  // 跳转到补给页面
  supply: function () {
    wx.redirectTo({
      url: '../supply/supply'
    })
  }
})
