// activity/member/presentation/presentation.js
const app = getApp();
import apiSettings from "../../../utils/ApiSetting"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCode: "gold",
    pathOptions: "",
    cardUrl: "",
    isBuy: false,
    openingStatus: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pathOptions: options,
      openingStatus: options.openingStatus
    })
    // this.changeTab(options.tabcode)
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
    this.checkMemberStatus()
    this.changeTab(this.data.pathOptions.tabcode)    
  },
  checkMemberStatus() {
    let openingStatus = 0, // 初始值 - 金卡、银卡均未开通
      userInfo = app.globalData.userInfo ? app.globalData.userInfo : {}
    console.log("userInfo >", userInfo)
    // 只开通了金卡
    if (userInfo.isMember == 1 && userInfo.silverMember == 0) {
      openingStatus = 1
    }
    // 只开通了银卡
    if (userInfo.isMember == 0 && userInfo.silverMember == 1) {
      openingStatus = 2
    }
    // 开通了金卡和银卡
    if (userInfo.isMember == 1 && userInfo.silverMember == 1) {
      openingStatus = 3
    }
    this.setData({
      openingStatus
    })
  },
  /**
   * 检测标签切换
   * @param {String} tabcode gold：金卡  silver：银卡
   */
  async changeTab(tabcode) {
    let isBuy = false
    switch (tabcode) {
      case "gold":
        if (this.data.openingStatus == 1 || this.data.openingStatus == 3) {
          isBuy = true
        } else {
          isBuy = false
        }
        this.setData({
          backgroundUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_bg.png",
          cardUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_card.png"
        })
        break;

      default:
        if (this.data.openingStatus == 2 || this.data.openingStatus == 3) {
          isBuy = true
        } else {
          isBuy = false
        }
        this.setData({
          backgroundUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_bg.png",
          cardUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_card.png"
        })
        break;
    }
    await this.checkMemberStatus()
    this.setData({
      isBuy,
      tabCode: tabcode
    })
  },
  // 立即开通
  toBuy() {
    wx.navigateTo({
      url: `/activity/member/member?tabcode=${this.data.tabCode}`
    });
  },
  // 查看权益
  toCheck() {
    wx.navigateTo({
      url: `/mine/member/equity/equity?tabcode=${this.data.tabCode}`
    });
  },

  /**
   * 获取组件数据方法
   * @param {入参} e 
   */
  getTabCode(e) {
    console.log("获取组件tab code e >>", e)
    this.setData({
      tabCode: e.detail
    })
    this.changeTab(e.detail)
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
})