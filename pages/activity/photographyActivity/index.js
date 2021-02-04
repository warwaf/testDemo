// pages/activity/photographyActivity/index.vue.js
import ActivityModel from '../activity-model'
import activityModel from '../activity-model'
import apiSettings from '../../../utils/ApiSetting'

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
    showLogin: false,
    showGetPhone: false,
    info_data: {},
    isEnd: false,
    endLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取页面参数
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'channel': app.globalData.actChannel,
      'pagehome':'true'
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
      this.checkSignupState()
      this.getQueryData('00')
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
      navTop: app.globalData.navHeight
    })
    this.checkSignupState()
    this.getQueryData('00')
  },
  // 获取完善信息状态
  getQueryData (val) {
    console.log("val >>", val)
    wx.request({
      url: apiSettings.queryInfoData,
      data: {
        unionId: app.globalData.unionid,
        channel: val,
        activityId: app.globalData.actId ? app.globalData.actId : ""
      },
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: data => {
        if (data.data.code == 200) {
          this.setData({
            info_data: data.data.result[0]
          })
        }
        console.log(data, 'data')
      }
    })
  },
  // 去集赞
  toPraise() {
    wx.navigateTo({
      url: '/pages/activity/clickPraise/clickPraise'
    });
  },
  // 去完善资料
  toUserDetail() {
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'btndetail': 'pagehome'
    })
    wx.navigateTo({
      url: '/pages/activity/seckilling/dataPerfect/index?way=00'
    });
  },
  // 去秒杀页
  toSeckill() {
    // 未登录判断
    if (!this.data.isLogin) {
      return this.setData({
        showLogin: true
      })
    }
    // 无手机号判断
    // if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
    //   return this.setData({
    //     showGetPhone: true
    //   })
    // }
    wx.navigateTo({
      url: '/pages/activity/seckilling/index'
    });
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
  // 检测用户报名状态
  checkSignupState() {
    let params = {
      unionId: app.globalData.unionid,
      check: 2,
      activityId: app.globalData.actId ? app.globalData.actId : ""
    }
    this.setData({
      isLoading: true,
      endLoading: true
    })
    wx.request({
      url: apiSettings.getActivityMsState,
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (result) => {
        console.log("报名状态 >>", result)
        let resData = result.data,
          _res = resData.result
        if (resData.code == 200) {
          this.setData({
            isSignup: _res.registrationState == 0 ? false : true,
            isSkilled: _res.buyState == 1001 ? true : false,
            isEnd: _res.buyState == 9999 ? true : false
          })
        }
        this.setData({
          isLoading: false,
          endLoading: false
        })
      }
    })
  },
  // 提交报名信息
  submitSignup() {
    let params = {
      unionId: app.globalData.unionid,
      phone: this.data.phoneNo,
      name: this.data.userName,
      identityType: this.data.identityType,
      ...this.data.region,
      check: 2,
      source: app.globalData.actChannel || "",
      activityId: app.globalData.actId ? app.globalData.actId : ""
    }
    let storageVerifyCode = wx.getStorageSync('verifyCode') || app.globalData.verifyCode
    console.log("报名信息 >>", params, this.data.verifyCode)
    console.log("获取验证码 >>", this.data.verifyCode, "storage >>", storageVerifyCode, "wx storage >>", wx.getStorageSync('verifyCode'))
    if (params.city == "") {
      return wx.showToast({
        title: '请选择所在城市',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.name == "") {
      return wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1500
      });
    }
    if (!params.identityType) {
      return wx.showToast({
        title: '请选择您的身份',
        icon: 'none',
        duration: 1500
      });
    }
    if (params.phone == "") {
      return wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      });
    }
    if (this.data.verifyCode == "" || this.data.verifyCode != storageVerifyCode) {
      return wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 1500
      });
    }
    this.setData({
      isLoading: true
    })
    // wx.showToast({
    //   title: '数据提交成功',
    //   icon: 'none',
    // });
    // return
    wx.request({
      url: apiSettings.saveActivityMsRegistration,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        console.log("提交报名 >>", result)
        let resData = result.data,
          _res = resData.result
        if (resData.code == 200) {
          if (_res.registrationState == 1) {
            app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
              'btnsignup': 'success'
            })
            wx.showToast({
              title: '恭喜您，报名成功！',
              icon: 'none',
              duration: 1500
            });
          }
          this.resetParmas()
          this.setData({
            showSignup: false,
            isLoading: false,
            isSignup: _res.registrationState == 0 ? false : true
          })
        } else {
          wx.showToast({
            title: '报名失败，请联系客服！',
            icon: 'none',
            duration: 1500
          });
        }
      }
    })
  },
  // 重置报名信息
  resetParmas() {
    wx.setStorageSync("verifyCode", "")
    this.setData({
      phoneNo: "",
      userName: "",
      identityType: undefined,
      region: {
        province: "",
        provinceName: "",
        city: "",
        cityName: ""
      },
      verifyCode: ""
    })
  },
  // 验证码-监听输入
  bindCodeInput: function (e) {
    console.log("输入验证码 >>", e.detail.value, "wx storage >>", wx.getStorageSync("verifyCode"))
    this.setData({
      verifyCode: e.detail.value
    })
  },
  // 姓名-监听输入
  watchName: function (e) {
    let val = e.detail.value,
      reg = /^[\u4E00-\u9FA5A-Za-z]+$/
    if (!reg.test(val)) {
      val = val.substring(0, val.length - 1)
      this.setData({
        userName: val
      })
      wx.showToast({
        title: '姓名不正确（只能是英文、汉字）',
        icon: "none"
      })
    } else {
      this.setData({
        userName: val
      })
    }
  },
  // 手机号-监听输入
  watchPhoneNo: function (e) {
    let val = e.detail.value,
      reg = /(^[1][0-9][0-9]{9}$)/
    console.log("phone >", val)
    if (val.length == 11) {
      if (!reg.test(val)) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: "none",
          duration: 1500
        })
        this.setData({
          isPhoneNo: false,
          disSend: true,
          phoneNo: ""
        })
      } else {
        this.setData({
          phoneNo: val,
          isPhoneNo: true,
          disSend: false
        })
      }
    } else {
      this.setData({
        isPhoneNo: false,
        disSend: true
      })
    }
  },
  handlePop(e) {
    let {
      type
    } = e.currentTarget.dataset
    switch (type) {
      case "close":
        this.setData({
          showErrPhone: false
        })
        break;

      default:
        break;
    }
  },
  // 控制报名弹窗
  handleSignup(e) {
    // console.log("signup >>", e)
    let dataset = e.currentTarget.dataset
    switch (dataset.type) {
      case 'show':
        console.log("报名 >>", this.data.isLogin, app.globalData)
        // 未登录判断
        if (!this.data.isLogin) {
          return this.setData({
            authorityTips: true
          })
        }
        // // 无手机号判断
        // if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
        //   return this.setData({
        //     getPhone: true
        //   })
        // }
        app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
          'btnsignup': 'click'
        })
        this.setData({
          showSignup: true
        })
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
  // 身份选择
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const identityList = this.data.identityList
    for (let i = 0, len = identityList.length; i < len; ++i) {
      identityList[i].checked = identityList[i].value === e.detail.value
    }
    this.setData({
      identityList: identityList,
      identityType: e.detail.value
    })
  },
  // 获取短信验证码
  getSMSCode() {
    if (this.data.disSend || this.data.phoneNo == "") {
      return wx.showToast({
        title: '手机号错误',
        icon: 'none',
        image: '',
        duration: 1500
      });
    }
    this.tiemControl()
    this.setData({
      isSend: true
    })
    activityModel.sendMessage(this.data.phoneNo).then(res => {
      console.log("send msg code >>", wx.getStorageSync("verifyCode"))
      if (res.code == 0) {
        wx.showToast({
          title: '验证码已发送，请注意查收~~',
          icon: 'none',
          image: '',
          duration: 1500
        })
      }
    })
  },
  // 验证码倒计时
  tiemControl() {
    if (this.data.sendTime <= 0) {
      this.setData({
        disSend: false,
        isSend: false,
        sendTime: 60
      })
    } else {
      let time = this.data.sendTime
      time--
      var tiemer = setTimeout(() => {
        this.tiemControl()
      }, 1000)
      this.setData({
        sendTime: time
      })
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
        wx.showToast({
          title: '授权成功'
        });
      // if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
      //   this.setData({
      //     getPhone: true,
      //     loadingStatus: false
      //   })
      // }
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
  // getPhoneNumber(e) {
  //   this.setData({
  //     loadingStatus: true
  //   })
  //   console.log(e)
  //   ActivityModel.getUnionid().then(() => {
  //     wx.request({
  //       url: apiSettings.Host + apiSettings.GetUserPhone,
  //       method: 'POST',
  //       data: {
  //         encryptedDataStr: e.detail.encryptedData,
  //         ivStr: e.detail.iv,
  //         keyBytesStr: app.globalData.session_key
  //       },
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       success: res => {
  //         if (res.data.code !== 200 || !res.data.result.phoneNumber) {
  //           this.setData({
  //             loadingStatus: false,
  //             showErrPhone: true
  //           })
  //           return
  //         }
  //         app.globalData.userInfo.mobileNo = res.data.result.phoneNumber
  //         wx.showToast({
  //           title: '授权成功，请继续操作！'
  //         });
  //         this.checkSignupState()
  //         this.setData({
  //           getPhone: false,
  //           phoneNo: res.data.result.phoneNumber,
  //           showErrPhone: false
  //         })
  //         wx.request({
  //           url: apiSettings.Updatauser,
  //           data: {
  //             unionId: app.globalData.unionid,
  //             mobileNo: res.data.result.phoneNumber
  //           },
  //           header: {
  //             "Content-Type": "application/json",
  //             accessToken: app.globalData.mtq_token
  //           },
  //           method: 'POST',
  //           success: data => {
  //             // this.setData({
  //             //   getPhone: false,
  //             //   phoneNo: res.data.result.phoneNumber
  //             // })
  //           }
  //         })
  //       },
  //       fail: res => {
  //         this.setData({
  //           showErrPhone: true
  //         })
  //       }
  //     })
  //   })
  // },
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
    wx.setStorageSync("verifyCode", "")
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
    console.log("shar actid", app.globalData.actId ? app.globalData.actId : "")
    return {
      title: '三亚鲜檬0元旅拍',
      path: `/pages/activity/photographyActivity/index?actId=${app.globalData.actId ? app.globalData.actId : ""}`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20200906/share-img.png"
    }
  }
})
