// pages/activity/scheduling/checkSchedule/checkSchedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectDate: "",
    storeNo: "",
    storeName: '',//门店名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectDate: options.photoDate || "",
      storeNo:  options.storeNo || "",
      storeName:  options.storeName || "",
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
   * 确认拍摄日期
   * onCalendarDayTap方法已获取数值，此处仅做跳转
   */
  confirmDate() {
    wx.redirectTo({
      url: `/pages/activityTA/scheduling/scheduling?photoDate=${this.data.selectDate}&from=check`
    });
  },
  /**
   * 选择时间
   * @param {*} e 
   */
  onCalendarDayTap(e) {
    let selectDate = e.detail
    this.setData({
      selectDate: selectDate
    })
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
  // onShareAppMessage: function () {

  // }
})