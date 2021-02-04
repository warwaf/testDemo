// pages/activity/guide/index.vue.js
import util from "../../../utils/util"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTA: 3,
    timeInterval: null,
    // showTime: "2020/12/31 23:59:59", // 霸屏页开始展示时间
    // showTime: "2020/12/29 10:10:10", // 霸屏页开始展示时间
    // endTime:'2021/01/05 23:59:59',// 元旦活动结束时间
    // startTime: "2020/10/22 00:00:00" // 双活动开始时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // let currentTime = this.dateGetTime(util.formatTime1(new Date()).replace(/-/ig, "/"))
    // let startTime = this.dateGetTime(this.data.showTime) //活动开始时间
    // let endTime = this.dateGetTime(this.data.endTime)
    // if(currentTime<startTime||currentTime>endTime){
    //   app.globalData.newYearActOver = true
    //   wx.switchTab({
    //       url: '/pages/album/checkin/checkin',
    //   })
    //   return
    // }
    // console.log(this.dateGetTime(this.data.showTime),this.dateGetTime(currentTime))
    // if (this.dateGetTime(this.data.showTime) > this.dateGetTime(currentTime)) {
    //   // 如果霸屏页开始展示时间大于当前时间，则跳至首页
    //   wx.switchTab({
    //     url: '/pages/album/checkin/checkin',
    //   })
    //   return
    // }
    // if (this.dateGetTime(currentTime) >= this.dateGetTime(this.data.startTime)) {
    //   this.setData({
    //     showTA: 2
    //   })
    // } else {
    //   this.setData({
    //     showTA: 1
    //   })
    // }
    // console.log(this.data.startTime, 'this.data.startTime111')
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
    // this.setData({
    //   navTop: app.globalData.navHeight
    // })
    // let currentTime = ""
    // let timeInterval = setInterval(() => {
    //   currentTime = util.formatTime1(new Date()).replace(/-/ig, "/")
      // if (this.dateGetTime(this.data.showTime) > this.dateGetTime(currentTime)) {
      //   wx.switchTab({
      //     url: '/pages/album/checkin/checkin',
      //   })
      //   return
      // }
    //   if (this.dateGetTime(currentTime) >= this.dateGetTime(this.data.startTime)) {
    //     this.setData({
    //       showTA: 2
    //     })
    //   } else {
    //     this.setData({
    //       showTA: 1
    //     })
    //   }
    //   // console.log(currentTime)
    // }, 1000)
    // this.setData({
    //   timeInterval: timeInterval
    // })
  },
  //去元旦活动详情页
  toNewYear(){
    // console.log(123123123)
    let url = '/activity/arAct/arAct'
    wx.navigateTo({url})
  },
  dateGetTime(date) {
    return new Date(date).getTime()
  },
  toActivity(e) {
    let {
      code
    } = e.currentTarget.dataset
    let jumpUrl = ""
    switch (code) {
      case "sy":
        jumpUrl = "/pages/activity/photographyActivity/index?actId=1"
        break;

      default:
        jumpUrl = "/pages/activityTA/photographyActivity/index?actId=2"
        break;
    }
    wx.navigateTo({
      url: jumpUrl
    })
  },
  // 去秒杀活动首页
  toSeckillHome() {
    wx.navigateTo({
      url: '/pages/activity/photographyActivity/index?actId=1'
    });
  },
  // 去相册首页
  toHome() {
    wx.switchTab({
      url: '/pages/album/checkin/checkin'
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log(this.data.timeInterval)
    // clearInterval(this.data.timeInterval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(this.data.timeInterval)
    // clearInterval(this.data.timeInterval)
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

  }
})