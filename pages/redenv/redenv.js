// pages/ redenv/redenv.js
var that=this;
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
   userId:0,
   redPackage:[],
  },
  onLoad: function (options) {
    var that=this;
    this.setData({
      userId:options.userId,
    })
    wx.request({
      url: app.globalData.url + "/RedPackage/" + options.userId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data.status){
          var value = res.data.value;
          var redPackage = new Array;
          for(var i=0; i<value.length; i++){
            var isGiven="";
            if (value[i].giveOut){
              isGiven="已领取";
            }else{
              isGiven = "未领取";
            }
            var record={
              drawTime: value[i].drawTime.substring(0,10),
              amount: value[i].amount,
              giveOut: isGiven,
            };
            redPackage.push(record);
          }
          that.setData({
            redPackage: redPackage,
          });
        }else{
          util.isError("数据更新，请返回首页重试");
        }
      }
    })
  },
  toSupply: function () {
    wx.redirectTo({
      url: '../supply/supply'
    })
  },
  
})