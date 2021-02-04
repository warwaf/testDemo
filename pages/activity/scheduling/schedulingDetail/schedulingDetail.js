// pages/activity/scheduling/schedulingDetail/schedulingDetail.js
var Mcaptcha = require("../../../../utils/mcaptcha.js")
import apiSettings from '../../../../utils/ApiSetting.js'
import util from '../../../../utils/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    loadingText: 'Yoo-hoo! 努力加载啦',
    storeName: '',//预约门店
    orderNo: '',//订单号
    flightNo: '',//航班号
    checkInDate: '',//入住日期
    checkOutDate: '',//退房日期
    userName: '',//姓名
    userPhone: '',//手机号
    reservationsDate: '',//拍摄日期
    tool: '',//交通工具
    schedule: '',//航班号
    canRes: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCalendarDetail(options.orderNo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 预约详情
  getCalendarDetail (orderNo) {
    this.setData({
      isLoading: true
    })
    wx.request({
      url: apiSettings.getReservations,
      data: {
        activityId: app.globalData.actId ? app.globalData.actId : '',
        orderNo: orderNo
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        this.setData({
          isLoading: false
        })
        let _res = res.data
        if (_res.code == 200) {
          wx.request({
            url: apiSettings.getCanBeReservations,
            data: {
              orderNo: _res.result.orderNo
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: res => {
              if (res.data.code == 200) {
                this.setData({
                  canRes: res.data.result.canRes
                })
              } else {
                wx.showToast({
                  title: '接口报错',
                  icon: 'none',
                  duration: 1500
                });
              }
            },
            fail: () => {},
            complete: () => {}
          })
          let userName = []
          let userPhone = []
          let reservationsDate = ''
          for (var index in  _res.result.reservations) {
              userName.push(_res.result.reservations[index].reservationsName)
              userPhone.push(_res.result.reservations[index].mobileNo)
           }
           if (_res.result.reservationsDate) {
            reservationsDate = this.formatDate(new Date(_res.result.reservationsDate))
          }
           let flightNo,checkInDate,checkOutDate = ''
          //  if (_res.result.remarksList[_res.result.remarksList.length-1].remarks&&_res.result.remarksList[_res.result.remarksList.length-1].remarks.indexOf(";") != -1) {
          //   flightNo = _res.result.remarksList[_res.result.remarksList.length-1].remarks.split(";")[0].split(":")[1],
          //   checkInDate = _res.result.remarksList[_res.result.remarksList.length-1].remarks.split(";")[1].split(":")[1],
          //   checkOutDate = _res.result.remarksList[_res.result.remarksList.length-1].remarks.split(";")[2].split(":")[1]
          // }
          this.setData({
            storeName: _res.result.storeName,
            orderNo: _res.result.orderNo,
            flightNo: flightNo,
            checkInDate: checkInDate,
            reservationsDate: reservationsDate,
            checkOutDate: checkOutDate,
            userName: userName.join(','),
            userPhone: userPhone.join(','),
            tool: _res.result.traffic?_res.result.traffic.tool:'',
            schedule: _res.result.traffic?_res.result.traffic.schedule:''
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  // 取消预约
  getCalendarCancel (e) {
    this.setData({
      isLoading: true,
      loadingText: 'Yoo-hoo! 取消预约中'
    })
    const { orderNo } = e.currentTarget.dataset
    console.log(item, 'item<<')
    wx.request({
      url: apiSettings.getCalendarCancel,
      data: {
        orderNo: orderNo,
        storeId: item.storeId,
        activityId: app.globalData.actId ? app.globalData.actId : '',
        reservationsDate: item.reservationsDate,
      },
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: res => {
        console.log('取消', res)
        this.setData({
          isLoading: false,
          loadingText: 'Yoo-hoo! 取消预约中'
        })
        if (res.data.meta.code == 200) {
          wx.showToast({
            title: '成功取消预约',
            icon: 'none',
          })
          wx.navigateTo({
            url: '../scheduling',
          })
        } else {
          wx.showToast({
            title: res.data.meta.msg,
            icon: 'none',
          })
        }
      },
      fail: err => {
        this.setData({
          isLoading: false,
          loadingText: 'Yoo-hoo! 取消预约中'
        })
      }

    })
  },
  // 修改跳转
  getModify () {
    wx.redirectTo({
      url: '../scheduling?no='+this.data.orderNo,
    })
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
   * 格式化日期
   * @param {*} param new Date()
   */
  formatDate(param) {
    const date = param ? param : new Date();
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) {
      m = '0' + m
    }
    if (d < 10) d = '0' + d;
    return y + '-' + m + '-' + d;
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})