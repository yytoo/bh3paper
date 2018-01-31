// pages/supplyList/supplyList.js
const app = getApp();
var util = require('../../utils/util.js');
var that=this;
Page({
  data: {
    supplyType: '',
    supplyInfo: [],
    StarColor: [],
    toSupplyBtnOp: false,
    time:"一",
    againType:'',
  },
  onLoad: function (options) {
    if (options.supplyType) {
      this.setData({
        supplyType: options.supplyType
      })
    }
    // 判断单抽还是十连
    if (this.data.supplyType == 'tenSupply') {
      this.setData({
        time:"十",
        animationData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
      })
    } else if (this.data.supplyType == 'oneSupply') {
      this.setData({
        animationData: [{}, {}]
      })
    } else {
      wx.redirectTo({
        url: '../supply/supply'
      });
      console.log('error');
    }
  },
  onShow: function () {
    var that = this;
    // 判断单抽还是十连
    if (this.data.supplyType == 'tenSupply') {
      this.getTenSupplyInfo();
      that.tenSupplyAnimate();
    } else if (this.data.supplyType == 'oneSupply') {
      this.getOneSupplyInfo();
      that.oneSupplyAnimate();
    } else {
      if (this.data.againType == 'oneSupply'){
        that.oneSupplyAnimate();
      } else if (this.data.againType =='tenSupply'){
        that.tenSupplyAnimate();
      }else{
        wx.redirectTo({
          url: '../supply/supply'
        });
        console.log('error');
      }
     
    }
  },
  // 单抽动画
  oneSupplyAnimate: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out',
      transformOrigin: 'center center 0',
    })
    function animate(i) {
      setTimeout(function () {
        animation.scale(0.9, 0.9).opacity(1).step()
        that.data.animationData[i] = animation.export()
        that.setData({
          animationData: that.data.animationData
        })
      }, 500 * i)
    }
    for (var i = 0; i < 2; i++) {
      animate(i);
    }   
    setTimeout(function(){
      that.setData({
        toSupplyBtnOp: true,
         supplyType: '',
        againType: 'oneSupply',
      });
    },400)
    
    
    // if (app.supplyData.yueka) {
    //   setTimeout(function () {
    //     wx.vibrateShort()
    //     wx.showModal({
    //       title: '恭喜您获得【月卡】福利',
    //       content: '领取请联系QQ：XXXXXXXX',
    //     })
    //   }, 200 * i++);
    // }
  },
  // 十连动画
  tenSupplyAnimate: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out',
      transformOrigin: 'center center 0',
    })
    function animate(i){
      setTimeout(function () {
        animation.scale(0.9, 0.9).opacity(1).step()
        that.data.animationData[i] = animation.export()
        that.setData({
          animationData: that.data.animationData
        })
      }, 200 * i)
    }
    for(var i = 0; i < 20; i++) {
      animate(i);
    }
    setTimeout(function () {
      that.setData({
        toSupplyBtnOp: true,
        supplyType:'',
        againType:'tenSupply',
      });
    }, 4000)
    // if (app.supplyData.yueka) {
    //   setTimeout(function () {
    //     wx.vibrateShort()
    //     wx.showModal({
    //       title: '恭喜您获得【月卡】福利',
    //       content: '领取请联系QQ：XXXXXXXX',
    //     })
    //   }, 500 * i++);
    // }
  },
  // 单抽装备信息
  getOneSupplyInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/PresicePool/Draw/' +app.globalData.id+'/1',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data.status){
          that.sortSupplyInfo(res.data.value.poolItems);
          that.getColor();
          that.isRedPackage(res.data.value.redPackage,(400+200));
        }else{
          util.isError("蛋池更新中");
          that.setData({
            toSupplyBtnOp: true,
          })
        }
      }
    })
  },


  // 十连装备信息
  getTenSupplyInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/PresicePool/Draw/' + app.globalData.id +'/10',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.status) {
          that.sortSupplyInfo(res.data.value.poolItems);
          that.getColor();
          that.isRedPackage(res.data.value.redPackage, ((that.data.supplyInfo).length*200+200));
        }else{
          util.isError("蛋池更新中");
          that.setData({
            toSupplyBtnOp: true
          })
        }
      }
    })
  },

//红包提醒
  isRedPackage:function(redPackage,time){
    var sumMoney=0;
    if (redPackage!= undefined && redPackage.length != 0) {
      for (var i = 0; i < redPackage.length; i++){
        sumMoney = sumMoney + redPackage[i];
      }
      setTimeout(function () {
        wx.vibrateShort()
        wx.showModal({
          showCancel: false,
          title: '恭喜您获得【红包】福利',
          content: '恭喜您获得了' + sumMoney+'元红包，请在公众号“崩坏3情报室”回复“红包兑奖”获取兑奖方式',
        })
      }, time );
    }
  },

  // 装备排序
  sortSupplyInfo: function (info) {
    var supplyInfo = [];
    for (var i = 0; i < info.length; i++) {
      supplyInfo.push(info[i].left);
      supplyInfo.push(info[i].right);
      this.s
    }
    var sortInfoType12 = [];
    var sortInfoType3 = [];
    for (var i = 0; i < supplyInfo.length; i++){
      if (supplyInfo[i].type == 1 || supplyInfo[i].type == 2){
        var item = supplyInfo[i];
        item.num = 1;
        sortInfoType12.push(item);
      }
      if (supplyInfo[i].type == 3){
        if (sortInfoType3.length > 0) {
          var isRepeat=false;
          for (let j = 0; j < sortInfoType3.length; j++){
            if (supplyInfo[i].id == sortInfoType3[j].id){
              isRepeat=true;
              sortInfoType3[j].num ++;
              break;
            }
          }
          if(isRepeat==0){
            var item = supplyInfo[i];
            item.num = 1;
            sortInfoType3.push(item );
          }
        }else{
          var item = supplyInfo[i];
          item.num = 1;
          sortInfoType3.push(item);
        }
      }
    }
    var sortInfo = sortInfoType12.concat(sortInfoType3);
    this.setData({
      supplyInfo: sortInfo
    });
  },

  
  // 装备星级
  getColor: function () {
    var StarColor = [];
    for(var i = 0; i < this.data.supplyInfo.length; i++){
      if (this.data.supplyInfo[i].name == "月卡") {
        StarColor.push("#FFFF37");
        continue;
      }
      if (this.data.supplyInfo[i].star == "4") {
        StarColor.push("#9F4D95");
      }
      else if (this.data.supplyInfo[i].star == "2") {
        StarColor.push("#00BB00");
      }
      else {
        StarColor.push("#0080FF");
      } 
    }
    this.setData({
      StarColor: StarColor
    });
  },
  toSupply: function () {
    wx.redirectTo({
      url: '../supply/supply'
    })
  },
  tryAgain:function(){
    var that=this;
    wx.request({
      url: app.globalData.url + '/PresicePool/GetCurrent/' + app.globalData.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var time=0;
        if (res.data.status) {
          if (that.data.supplyType == 'oneSupply'){
                time=1;
          }else{
                time=10;
          }
          if (res.data.value.times<time){
            util.isError("抽奖次数不足，请返回首页明日再试");

          }else{
            wx.redirectTo({
              url: '../supplyList/supplyList?supplyType=' + that.data.againType,
            })
          }
        }else{
          util.showBusyModal("../supply/supply");
       }
      }
    });
    
  }
})