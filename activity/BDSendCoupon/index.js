// activity/BDSendCoupon/index.vue.js
import ActivityModel from '../activity-model'
import activityModel from '../activity-model'
import apiSettings from '../../utils/ApiSetting'
import {
  delay,
  js_date_time
} from "../../utils/util"

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: 0,
    isRule: false,
    swiperList1: [{
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample1.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample2.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample3.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample4.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample5.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample6.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample7.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample8.jpg'
      },
      {
        url: 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample9.jpg'
      }
    ],
    showSignup: false,
    identityList: [{
        value: '1',
        name: '新郎'
      },
      {
        value: '2',
        name: '新娘'
      }
    ],
    isSend: false,
    sendTime: 60,
    phoneNo: "",
    disSend: false,
    userName: "",
    isLogin: false,
    authorityTips: false,
    getPhone: false,
    isSignup: false,
    isSkilled: false,
    region: {
      province: "",
      provinceName: "",
      city: "",
      cityName: ""
    },
    verifyCode: "",
    showErrPhone: false,
    isLoading: false,
    showFull: false,
    mtaInfo: {
      name: "c_mtq_activity_seckill"
    },
    viewId: "",
    hideTool: false,
    photoDate: "",
    startDate: "2020-08-13",
    yearsList: [2020],
    year: 2020,
    monthsList: [8, 9, 10, 11, 12],
    month: 8,
    daysList: [],
    day: 1,
    value: [9999, 1, 1],
    submitParams: {
      manName: "",
      manPhone: "",
      manId: "",
      ladyName: "",
      ladyPhone: "",
      ladyId: ""
    },
    showBound: false,
    isBound: false,
    btnText: "查看报名信息",
    source: '',
    showConfirm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.hideShareMenu({
      withShareTicket: false
    })
    // 获取页面参数
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'channel': app.globalData.actChannel
    })
    this.setData({
      isLoading: true,
      couponId: options.id || "",
      source: options.c || ""
    })
    // 获取unionId
    try {
      let res = await ActivityModel.getUnionid()
      if (res) {
        this.setData({
          isLoading: false
        })
      }
    } catch (error) {
      this.setData({
        authorityTips: true,
        isLogin: false,
        isLoading: false
      })
    }
    // 获取用户信息
    try {
      this.setData({
        isLoading: true
      })
      const res = await ActivityModel.getUserInfoByUnionId()
      const _res = res ? res.result : {}
      console.log("user info >>>", _res)
      let globalData = app.globalData
      if (
        (!globalData.unionid || (globalData.unionid && globalData.unionid == "")) ||
        (!_res.nickName || (_res.nickName && _res.nickName == "")) ||
        (!_res.avatarUrl || (_res.avatarUrl && _res.avatarUrl == ""))
      ) {
        this.setData({
          authorityTips: true,
          isLogin: false
        })
      } else {
        this.setData({
          authorityTips: false,
          isLogin: true
        })
      }
      if (!_res.mobileNo || _res.mobileNo == "" || !globalData.userInfo.mobileNo || globalData.userInfo.mobileNo == "") {
        this.setData({
          getPhone: true
        })
      }
      if (_res) {
        this.setData({
          isLoading: false
        })
      }
      await this.checkCoupon()
    } catch (error) {
      this.setData({
        authorityTips: true,
        isLogin: false,
        isLoading: false
      })
    }
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
    this.setData({
      navTop: app.globalData.navHeight,
    })
    this.getNowDate()
  },
  toDetail() {
    if (this.data.btnText == "查看报名信息") {
      let back = `/activity/BDSendCoupon/index?id=${this.data.couponId}`
      back = encodeURIComponent(back)
      wx.navigateTo({
        url: `/pages/activity/seckilling/dataPerfect/index?way=01&back=${back}`
      })
    }
  },
  // 监听input值输入
  watchInput(e) {
    let {
      type
    } = e.currentTarget.dataset
    let param = `submitParams.${type}`
    let val = e.detail.value,
      phoneReg = /(^[1][0-9][0-9]{9}$)/,
      nameReg = /^[\u4E00-\u9FA5A-Za-z]+$/,
      idReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    switch (type) {
      case "manPhone":
      case "ladyPhone":
        if (val.length == 11) {
          if (!phoneReg.test(val)) {
            wx.showToast({
              title: `请输入正确的${type == 'manPhone' ? '新郎' : '新娘'}手机号`,
              icon: "none",
              duration: 1500
            })
          } else {
            this.setData({
              [param]: val
            })
          }
        }
        break;
      case "manName":
      case "ladyName":
        if (!nameReg.test(val)) {
          this.setData({
            [param]: ""
          })
          wx.showToast({
            title: '姓名只能是英文、汉字',
            icon: "none"
          })
        } else {
          this.setData({
            [param]: val
          })
        }
        break;
      case "manId":
      case "ladyId":
        // delay(() => {
        if (val.length == 18) {
          if (!idReg.test(val)) {
            wx.showToast({
              title: `请输入正确的${type == 'manId' ? '新郎' : '新娘'}身份证号码`,
              icon: "none"
            })
          } else {
            this.setData({
              [param]: val
            })
          }
        }
        // }, 3000)
        break;
      default:
        this.setData({
          [param]: val
        })
        break;
    }
    console.log("param >>", param, "val: ", val, this.data.submitParams[type], idReg.test(val))
  },
  // 获取当前日期
  getNowDate() {
    let timeStr = new Date().getTime()
    let nowDate = js_date_time(timeStr)
    nowDate = nowDate.split(" ")[0].replace(/\//g, "-")
    this.setData({
      startDate: nowDate
    })
  },
  // 监听日期选择
  async bindDateChange(e) {
    console.log("日期选择 >>", e)
    const val = e.detail.value
    this.setData({
      photoDate: val
    })
  },
  // 监听滚动条
  handleScroll(e) {
    let {
      scrollTop
    } = e.detail
    if (scrollTop > 200) {
      this.setData({
        hideTool: true
      })
    } else {
      this.setData({
        hideTool: false
      })
    }
  },
  // 调用子组件关闭地址选择器
  closeRegionSelect() {
    this.selectComponent("#cityPicker").closeSelect();
  },
  // 获取cityPicker data
  getRegion(e) {
    let data = e.detail
    let region = {
      province: data.provinceCode,
      provinceName: data.province,
      city: data.cityCode,
      cityName: data.city
    }
    this.setData({
      region: region
    })
    console.log("地址 >", data, this.data.region)
  },
  // 检测券是否已绑定
  checkCoupon() {
    let params = {
      unionId: app.globalData.unionid,
      couponId: this.data.couponId
    }
    this.setData({
      isLoading: true
    })
    wx.request({
      url: apiSettings.bdCheckCoupon,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        console.log("检测绑定 >>", result)
        if (result.data.code == 500 && result.data.message == "二维码已绑定") {
          this.setData({
            showBound: true,
            isBound: true,
            btnText: "二维码已绑定"
          })
        } else if (result.data.code == 500 && result.data.message == "该用户已绑定二维码") {
          this.setData({
            showBound: true,
            isBound: true,
            btnText: "查看报名信息"
          })
        }
        this.setData({
          isLoading: false
        })
      }
    })
  },
  // 提交报名信息
  submitSignup() {
    let params = {
      unionId: app.globalData.unionid,
      ...this.data.submitParams,
      ...this.data.region,
      source: app.globalData.actChannel || this.data.source,
      photographTime: this.data.photoDate,
      channel: "01"
    }
    if (params.manName == "") {
      return wx.showToast({
        title: '请输入新郎姓名',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.manPhone == "") {
      return wx.showToast({
        title: '请输入正确的新郎手机号',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.manId == "") {
      return wx.showToast({
        title: '请输入正确的新郎身份证',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.ladyName == "") {
      return wx.showToast({
        title: '请输入新娘姓名',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.ladyPhone == "") {
      return wx.showToast({
        title: '请输入正确的新娘手机号',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.ladyId == "") {
      return wx.showToast({
        title: '请输入正确的新娘身份证',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.city == "") {
      return wx.showToast({
        title: '请选择所在城市',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.photographTime == "") {
      return wx.showToast({
        title: '请选择正确的拍摄日期',
        icon: 'none',
        duration: 1500
      });
    }
    // return wx.showToast({
    //   title: '报名成功',
    //   icon: 'none'
    // });
    this.setData({
      showConfirm: true
    })
  },
  // 确认报名
  confirmSignup() {
    let params = {
      unionId: app.globalData.unionid,
      ...this.data.submitParams,
      ...this.data.region,
      source: app.globalData.actChannel || this.data.source,
      photographTime: this.data.photoDate,
      channel: "01"
    }
    this.setData({
      isLoading: true
    })
    wx.request({
      url: apiSettings.bdSignup,
      data: {
        couponId: this.data.couponId,
        activityMsResultInfo: {
          ...params
        }
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        console.log("提交报名 >>", result)
        let resData = result.data,
          _res = resData.result
        if (resData.code == 200) {
          app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
            'btnsignup': 'bd-success'
          })
          wx.showToast({
            title: '恭喜您，报名成功！',
            icon: 'none',
            duration: 1500
          });
          this.resetParmas()
        }
        this.setData({
          isLoading: false,
          showConfirm: false
        })
        if (resData.code == 500) {
          wx.showToast({
            title: resData.message,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },
  // 重置报名信息
  resetParmas() {
    let params = {
      manName: "",
      manPhone: "",
      manId: "",
      ladyName: "",
      ladyPhone: "",
      ladyId: ""
    }
    this.setData({
      submitParams: {
        ...params
      },
      photoDate: "",
      region: {
        province: "",
        provinceName: "",
        city: "",
        cityName: ""
      }
    })
    let back = `/activity/BDSendCoupon/index?id=${this.data.couponId}`
    back = encodeURIComponent(back)
    wx.navigateTo({
      url: `/pages/activity/seckilling/dataPerfect/index?way=01&back=${back}`
    })
  },
  // 关闭确认弹窗
  closeConfirm() {
    this.setData({
      showConfirm: false
    })
  },
  // 控制弹窗关闭
  handlePop(e) {
    let {
      type
    } = e.currentTarget.dataset
    switch (type) {
      case "close":
        this.setData({
          showBound: false,
          showConfirm: false
        })
        break;

      default:
        break;
    }
    wx.switchTab({
      url: '/pages/album/checkin/checkin',
    })
  },
  // 控制报名弹窗
  handleSignup(e) {
    // console.log("signup >>", e)
    let dataset = e.currentTarget.dataset
    switch (dataset.type) {
      case 'show':
        // 未登录判断
        if (!this.data.isLogin) {
          return this.setData({
            authorityTips: true
          })
        }
        // 无手机号判断
        if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
          return this.setData({
            getPhone: true
          })
        }
        app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
          'btnsignup': 'bd-click'
        })
        // if (!this.data.hideTool) {
        // this.setData({
        //   viewId: "signupInfo"
        // })
        var _this = this;
        var query = wx.createSelectorQuery().in(_this);
        query.selectViewport().scrollOffset()
        query.select("#signupInfo").boundingClientRect();
        query.exec(function (res) {
          console.log(res);
          var miss = res[0].scrollTop + res[1].top - 10;
          wx.pageScrollTo({
            scrollTop: miss,
            duration: 10
          });
        });
        // } else {
        this.submitSignup()
        // }
        break;

      default:
        this.resetParmas()
        this.setData({
          showSignup: false,
          showErrPhone: false
        })
        break;
    }
  },
  /**
   * 授权登录
   * @param {Object} e 微信授权信息
   */
  onGotUserInfo(e) {
    console.log(e)
    this.setData({
      loadingStatus: true
    })
    ActivityModel.updateUserInfo(e).then((res) => {
      console.log(res)
      this.setData({
        authorityTips: false,
        isLogin: true
      })
      if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
        wx.showToast({
          title: '授权成功'
        });
        this.setData({
          getPhone: true,
          loadingStatus: false
        })
      }
    })
  },
  /**
   * 关闭授权登录
   */
  hideAuthority() {
    this.setData({
      authorityTips: false
    })
  },
  /**
   * 关闭获取手机号弹窗
   */
  closeGetPhone() {
    console.log(111)
    this.setData({
      getPhone: false
    })
  },
  /**
   * 获取手机号
   * @param {Object} e 手机号授权信息
   */
  getPhoneNumber(e) {
    this.setData({
      loadingStatus: true
    })
    console.log(e)
    ActivityModel.getUnionid().then(() => {
      wx.request({
        url: apiSettings.Host + apiSettings.GetUserPhone,
        method: 'POST',
        data: {
          encryptedDataStr: e.detail.encryptedData,
          ivStr: e.detail.iv,
          keyBytesStr: app.globalData.session_key
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
          if (res.data.code !== 200 || !res.data.result.phoneNumber) {
            this.setData({
              loadingStatus: false,
              showErrPhone: true
            })
            return
          }
          app.globalData.userInfo.mobileNo = res.data.result.phoneNumber
          wx.showToast({
            title: '授权成功'
          });
          this.setData({
            getPhone: false,
            phoneNo: res.data.result.phoneNumber,
            showErrPhone: false
          })
          wx.request({
            url: apiSettings.Updatauser,
            data: {
              unionId: app.globalData.unionid,
              mobileNo: res.data.result.phoneNumber
            },
            header: {
              "Content-Type": "application/json",
              accessToken: app.globalData.mtq_token
            },
            method: 'POST',
            success: data => {
              // this.setData({
              //   getPhone: false,
              //   phoneNo: res.data.result.phoneNumber
              // })
            }
          })
        },
        fail: res => {
          this.setData({
            showErrPhone: true
          })
        }
      })
    })
  },
  stop() {
    return false
  },
  // 活动规则弹窗
  popupRule() {
    this.setData({
      isRule: true,
    })
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'btnrule': 'true'
    })
  },
  // 活动规则
  getRoleStyleImg() {
    this.setData({
      isRule: false
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
  onShareAppMessage: function () {
    return {
      title: '鲜檬0元三亚旅拍',
      path: `/pages/activity/photographyActivity/index`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20200906/share-img.png"
    }
  }
})
