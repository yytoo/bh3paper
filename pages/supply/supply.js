// pages/supply/supply.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    openId: '',
    id:0,
    username:"",
    times:0,
    picUrl1:"",
  },
  onLoad:function(){
    var that = this;
    that.setData({
      id: app.globalData.id,
      username: app.globalData.username,
      nickname: app.globalData.nickname,
    });
    if (app.globalData.id != null && app.globalData.id!=""){
      wx.request({
        url: app.globalData.url + '/PresicePool/GetCurrent/' + app.globalData.id,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.status) {
            that.setData({
              picUrl1: res.data.value.current.picUrl1,
              picUrl2: res.data.value.current.picUrl2,
              times: res.data.value.times,
            });
          }
        }
      })
    }else{
      wx.request({
        url: app.globalData.url + '/PresicePool/GetCurrent/1',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.status) {
            that.setData({
              picUrl1: res.data.value.current.picUrl1,
              picUrl2: res.data.value.current.picUrl2,
             
            });
          }
        }
      })
    }
    
  },
  toRule: function () {
    wx.redirectTo({
      url: '../rule/rule'
    })
  },
  toRed:function(){
    if (app.globalData.id != null && app.globalData.id!=""){
      wx.redirectTo({
        url: '../redenv/redenv?userId=' + app.globalData.id,
      })
    }else{
      util.isError("您还未注册，请先注册");
    }
   
  },
  toReg: function () {
    if (app.globalData.id == null || app.globalData.id == "") {
      wx.redirectTo({
        url: '../reg/reg',
      })
    } else {
      util.isError("您已登录账户，无需重复注册");
    }
  },
  oneSupply: function () {
    if (this.data.times==0){
      util.isError("今日无剩余抽奖次数");
    }else{
      wx.redirectTo({
        url: '../supplyList/supplyList?supplyType=oneSupply'
      })
    }
  },
  tenSupply: function () {
    if (this.data.times < 10) {
      util.isError("今日剩余抽奖次数小于10次");
    } else {
      wx.redirectTo({
        url: '../supplyList/supplyList?supplyType=tenSupply'
      })
    }
  }
})