// pages/activity/clickPraise/clickPraise.js
import apiSettings from '../../../utils/ApiSetting.js'
import util from '../../../utils/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalData: '',
    navTop:app.globalData.navHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLike()
  },
  // 获取点赞数量
  getLike () {
    wx.request({
      url: apiSettings.getLikedSumNum,
      data: {
      },
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: res=>{
        if (res.data.code == 200) {
          this.setData({
            totalData: res.data.result
          })
        }
      }
    })
  },
  // 点赞
  getClickLike () {
    wx.request({
      url: apiSettings.getLiked,
      data: {
        unionId: app.globalData.unionid,
        check: 0,
        activityId: app.globalData.actId ? app.globalData.actId : ""
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      success: res=>{
        if (res.data.code == 200) {
          if (res.data.result.liked==1) {
            wx.showToast({
              title: '您已点过赞',
            })
          } else {
            wx.showToast({
              title: '点赞成功',
            })
          }
          this.getLike()
        }
      }
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
      title: '泰安鲜檬0元婚纱摄影',
      path: `/pages/activityTA/photographyActivity/index?actId=${app.globalData.actId ? app.globalData.actId : ""}`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/seckill_ta/share-img.jpg"
    }
  }
})