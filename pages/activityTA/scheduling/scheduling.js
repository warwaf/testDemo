// pages/activity/scheduling/scheduling.js
import apiSetting from "../../../utils/ApiSetting"
import apiSettings from "../../../utils/ApiSetting";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trafficData: {},//选中的信息
    isSelectMenu: false,//交通工具弹窗
    showDate: false, // 日期弹窗
    photoDate: "", // 拍摄日期
    checkInDate: "", // 入住日期
    checkOutDate: "", // 退房日期
    userName: "", // 姓名
    userPhone: "", // 手机号
    options: {},
    schedule: "", // 航班号
    storeInfo: {
      storeName: "",
      storeNo: ""
    },
    vehicleList: [
      {value: '', name: '无'},
      {value: 0, name: '汽车'},
      {value: 1, name: '飞机'},
      {value: 2, name: '自驾车'},
      {value: 3, name: '高铁'},
      {value: 4, name: '火车'},
      {value: 5, name: '动车'}
    ],//交通工具列表
    deadline: "" // 截止日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let {
      photoDate,
      no
    } = options
    if (photoDate) {
      this.onCalendarDayTap(photoDate)
    }
    if (no) {
      app.globalData.schedulUserInfo = {
        no
      }
    }
    this.setData({
      options: options
    })
    this.getInfo()
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
   * 监听input
   * @param {*} e 
   */
  handleInput(e) {
    let value = e.detail.value
    console.log(e, value)
    this.setData({
      schedule: value
    })
  },
  /**
   * 保存预约信息
   */
  submit() {
    if (!this.data.photoDate) {
      return wx.showToast({
        title: '拍摄日期必填',
        icon: 'none',
        duration: 1500,
        mask: false
      });
    }
    let params = {
      activityId: app.globalData.actId ? app.globalData.actId : '',
      orderNo: app.globalData.schedulUserInfo.no,
      storeCode: this.data.storeInfo.storeNo,
      reservationName1: this.data.userName.split("、")[0],
      reservationPhone1: this.data.userPhone.split("、")[0],
      reservationName2: this.data.userName.split("、")[1],
      reservationPhone2: this.data.userPhone.split("、")[1],
      photoDate: this.data.photoDate,
      checkInDate: this.data.checkInDate,
      checkOutDate: this.data.checkOutDate,
      schedule: this.data.schedule,
      tool:this.data.trafficData.value,
      reservationsId: this.data.reservationsId
    }
    wx.request({
      url: apiSettings.saveReservations,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(">>", res)
        let _res = res.data
        if (_res.code == 200) {
          wx.redirectTo({
            url: `/pages/activityTA/scheduling/schedulingDetail/schedulingDetail?orderNo=${app.globalData.schedulUserInfo.no}`
          })
        } else {
          if (_res.code == 500 && _res.message == "该日期已约满") {
            wx.showToast({
              title: '该日期已约满',
              icon: 'none',
              duration: 1500,
              mask: false
            });
          } else {
            wx.showToast({
              title: _res.message,
              icon: 'none',
              duration: 1500,
              mask: false
            });
          }
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  /**
   * 获取完善信息
   */
  getInfo() {
    let {
      no
    } = app.globalData.schedulUserInfo
    console.log("get info >>", no)
    wx.request({
      url: apiSetting.getReservations,
      data: {
        activityId: app.globalData.actId ? app.globalData.actId : '',
        orderNo: no
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log("get info", res)
        let _res = res.data,
          info = [],
          userName = "",
          userPhone = "",
          storeInfo = {},
          reservationsId = "",
          photoDate = "",
          checkInDate = "",
          checkOutDate = "",
          schedule = ""
        if (_res.code == 200) {
          info = _res.result.reservations
          console.log(">>", info)
          storeInfo = {
            storeName: _res.result.storeName,
            storeNo: _res.result.storeNo
          }
          reservationsId = _res.result.reservationsId
          // 从查看档期页返回不使用接口日期
          if (this.data.options.from != "check") {
            if (_res.result.reservationsDate) {
              photoDate = this.formatDate(new Date(_res.result.reservationsDate))
            }
            // if (_res.result.remarksList[_res.result.remarksList.length - 1].remarks && _res.result.remarksList[_res.result.remarksList.length - 1].remarks.indexOf(";") != -1) {
            //   checkInDate = _res.result.remarksList[_res.result.remarksList.length - 1].remarks.split(";")[1].split(":")[1],
            //   checkOutDate = _res.result.remarksList[_res.result.remarksList.length - 1].remarks.split(";")[2].split(":")[1]
            // }
            this.setData({
              photoDate: photoDate,
              checkInDate,
              checkOutDate
            })
          } else {
            photoDate = this.data.options.photoDate
            this.onCalendarDayTap(photoDate)
          }
          // if (_res.result.remarksList[_res.result.remarksList.length - 1].remarks && _res.result.remarksList[_res.result.remarksList.length - 1].remarks.indexOf(";") != -1) {
          //   schedule = _res.result.remarksList[_res.result.remarksList.length - 1].remarks.split(";")[0].split(":")[1]
          // }
          if (info.length > 1) {
            userName = info[0].reservationsName + "、" + info[1].reservationsName
            userPhone = info[0].mobileNo + "、" + info[1].mobileNo
          } else {
            userName = info[0].reservationsName
            userPhone = info[0].mobileNo
          }
        } else {
          wx.showToast({
            title: '预约失败，请联系客服咨询',
            icon: 'none',
            duration: 1500
          });
        }
        let tool = {}
        this.data.vehicleList.forEach(element => {
          if (_res.result.traffic) {
            if (element.value==_res.result.traffic.tool) {
              tool = element
            }
          }
        });
        this.setData({
          userName: userName,
          userPhone: userPhone,
          storeInfo: storeInfo,
          reservationsId: reservationsId,  
          schedule: _res.result.traffic?_res.result.traffic.schedule:'',
          trafficData: tool
        })
      },
      fail: () => {},
      complete: () => {}
    });
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
   * 确认拍摄日期
   * onCalendarDayTap方法已获取数值，此处仅做关闭弹窗
   */
  confirmDate() {
    this.setData({
      showDate: false
    })
  },
  /**
   * 选择时间
   * @param {*} e 
   */
  onCalendarDayTap(e) {
    console.log("》》", e)
    if (e.detail == "") {
      this.setData({
        photoDate: "",
        checkInDate: "", // 入住日期
        checkOutDate: "", // 退房日期
      })
      return
    }

    let selectDate = e.detail || e,
      inDate = "",
      outDate = ""
    inDate = this.formatDate(new Date(new Date(selectDate).getTime() - 24 * 3600 * 1000))
    outDate = this.formatDate(new Date(new Date(selectDate).getTime() + 24 * 3600 * 1000))
    console.log("selectDate", selectDate, "inDate", inDate, "outDate", outDate)
    this.setData({
      photoDate: selectDate,
      checkInDate: inDate, // 入住日期
      checkOutDate: outDate, // 退房日期
    })
    console.log("photoDate", this.data.photoDate, "checkInDate", this.data.checkInDate, "checkOutDate", this.data.checkOutDate)
  },
  /**
   * 交通工具弹窗
   * */ 
  popupSelect (item) {
    console.log(item.target.dataset.name, 'item<<<')
    if (item.target.dataset.name!=undefined) {
      this.setData({
        isSelectMenu: false,
        trafficData: item.target.dataset.name
      })
      if (this.data.trafficData.name=='无') {
        this.setData({
          trafficData: {
            value: '',
            name: '',
          }
        })
      }
      // this.data.trafficData.value==''?'':this.data.trafficData.value
      // if (item.target.dataset.name.name!='无'){
      //   console.log(item.target.dataset.name.name, 'item.target.dataset.name.name')
      //   this.setData({
      //     trafficData: item.target.dataset.name
      //   })
      // }
      return
    }
    this.data.isSelectMenu?this.setData({
      isSelectMenu: false
    }):this.setData({
      isSelectMenu: true
    })
  },
  /**
   * 查看档期
   */
  toCheck() {
    wx.navigateTo({
      url: `/pages/activityTA/scheduling/checkSchedule/checkSchedule?photoDate=${this.data.photoDate}&storeNo=${this.data.storeInfo.storeNo}&storeName=${this.data.storeInfo.storeName}`,
    })
  },
  /**
   * 控制弹窗
   * @param {*} e 
   * @param {String} name 弹窗名称
   * @param {String} state 弹窗开启(show)/关闭(close)
   */
  handlePop(e) {
    console.log(e)
    let {
      name,
      state
    } = e.currentTarget.dataset
    switch (state) {
      case "show":
        switch (name) {
          case "date":
            // this.getCalendarList()
            wx.hideToast();
            this.setData({
              showDate: true
            })
            break;
        }
        break;
      default:
        switch (name) {
          case "date":
            if (!this.data.photoDate) {
              this.setData({
                showDate: false,
                photoDate: "",
                checkInDate: "", // 入住日期
                checkOutDate: "", // 退房日期
              })
            } else {
              this.setData({
                showDate: false
              })
            }
            break;
        }
        break;
    }
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