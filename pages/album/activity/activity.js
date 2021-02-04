// pages/album/activity/activity.js
import {Activity} from "./request"
import apiSettings from '../../../utils/ApiSetting.js'
const Requset = new Activity();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponData: [],//领取优惠券数据
    couponList: [],//领取优惠券列表
    receiveDialog: false,//领券弹窗
    pageOptions: {},
    pageConfig: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'optionsoptions')
    this.getActivityCoupon(options.room_no)
    if(options.scene){
      options = parseQueryString(decodeURIComponent(decodeURIComponent(options.scene)))
    }
    wx.setNavigationBarTitle({
      title: `${options.activityName ? options.activityName : '物联相册'}` 
    })
    this.setData({
      pageOptions: options
    })
    this._getConfig(options.room_no);
  },
  getActivityCoupon (room_no) {
      console.log(app.globalData, 'globalData')
      wx.request({
        url: apiSettings.getActivityCoupon,
        data: {
          activityId: room_no,
          unionId: app.globalData.userInfo.unionId
        },
        header: {
          "Content-Type": "application/json",
        },
        method: "POST",
        success: res => {
            console.log(res, 'res<<<1111')
            if (res.data.code==200) {
              this.setData({
                  receiveDialog: res.data.result.success,
                  couponList: res.data.result.fileList,
                  couponData: res.data.result.fileList[0]
              })
            }
        }
      })
  },
  //领取优惠券弹窗
  getClose () {
      this.setData({
          receiveDialog: false,
      })
  },
  // 领取优惠券
  getReceive () {
      let _this = this
      wx.request({
        url: apiSettings.takeActivityTaCoupon,
        data: {
          activityId: this.data.pageOptions.room_no,
          unionId: app.globalData.userInfo.unionId
        },
        header: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        success: res => {
            if (res.data.code == 200) {
              _this.setData({
                  couponData: _this.data.couponList[1]
              })
            } else {
              _this.setData({
                  couponData: _this.data.couponList[2]
              })
            }
            console.log(res, 'res<<<<<')
        }
      })
  },
  _getConfig: function (room_no) {
    Requset.getConfig(room_no)
      .then(res => {
        if(res.code == 200) {
          //let obj = res.result
          //obj.venues = [res.result.venues[0]]
          this.setData({
            pageConfig: res.result
          })
          // res.result.venues
          wx.setStorageSync('PATHCONFIG', res.result.venues)
        }
      })
  }, 
  jump: function (e) {
    wx.navigateTo({
      url: `/pages/album/activityList/activityList?activityId=${this.data.pageOptions.room_no}&scenes=${e.currentTarget.dataset.scenes.scenes}`,
    })
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
    
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.pageOptions.activityName?this.data.pageOptions.activityName:'物联相册',
      path: `/pages/album/activity/activity?room_no=${this.data.pageConfig.activityId}&activityName=${this.data.pageOptions.activityName}`,
      //imageUrl:"https://hcmtq.oss-accelerate.aliyuncs.com/SystemImg/30fx.jpg"
    }
  }
})