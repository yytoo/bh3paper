// pages/reg/reg.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    showTopTips: false,
    errorMsg: "",
    notRealPromiseException: 0,
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },


  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用   
    var nickname = e.detail.value.nickname;
    var username = e.detail.value.username;
    var password = e.detail.value.password;
    var subPassword = e.detail.value.subPassword;
    var openid = app.globalData.openId;
    var that = this;

    var reg = /^\w+$/;

    //判断是否为空
    if (that.isNull(username, "用户名") == 0) {
      return;
    }
    //判断用户名是否已被注册
    wx.request({
      url: app.globalData.url + "/api/UserRegiste/Check/" + username,
      method: 'GET',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status == 2) {
          util.isError("用户名已被注册，请重新填写");
          console.log(res.data.status + "用户名已注册");
          return;
        } else {
          console.log(res.data.status + "用户名可用");
          //判断是否为空
          if (that.isNull(nickname, "昵称") == 0) {
            return;
          }
          //判断是否为空
          if (that.isNull(password, "密码") == 0) {
            return;
          }
          //判断密码和确认密码是否一致
          if (subPassword != password) {
            util.isError("密码不一致");
            return;
          }
          //判断openid是否为空
          if (openid==null  || openid==""){
            util.isError("微信登录失败，请稍后再试");
            return;
          }
          //判断用户名昵称字符串类型字母数字下划线
          if (reg.test(username)) {
          } else {
            util.isError("用户名只能包含字母数字下划线");
            return;
          }
          //发送用户信息前往注册
          wx.request({
            url: app.globalData.url + "/api/UserRegiste/Post",
            data: {
              "Username": username,
              "Nickname": nickname,
              "Password": password,
              "OpenId": openid,
            },
            method: 'post',
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              if (res.data.status == 1) {
                console.log("注册成功" + res.data.status + res.data.errorInfo);
                wx.showModal({
                  title: '登录成功',
                  content: '是否跳转至抽奖页面？',
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '../index/index',
                      })
                    } else if (res.cancel) {
                      
                    }
                  }
                })
              } else {
                //这里做跳转
                util.isError(res.data.erroInfo);
                console.log("注册失败" + res.data.status + res.data.errorInfo);
              }

            },
            fail: function (res) {
              console.log("注册失败*****");
            }
          })
        };

      },
      fail: function (res) {
        console.log("连接失败2*****");
        reject("注册用户名失败");
      }
    })

  },

  //判断是否为空
  isNull: function (val, key) {
    var flag = 1;
    if ("" == util.trim(val)) {
      util.isError(key + "不能为空");
      flag = 0;
    }
    return flag;
  },
  toIndex: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})