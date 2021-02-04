//Page Object
var Mcaptcha = require("../../../utils/mcaptcha.js")
import apiSettings from "../../../utils/ApiSetting"
import ExchangeModel from './exchange-model'

const app = getApp()

Page({
  data: {
    isAgree: true,
    disBtn: false,
    showProtocolPop: false,
    exchangeCode: "",
    imgCode: "",
    showStatusPop: false,
    statusCode: 0, // 0: 其它情况 1：成功 2：失败 3：暂停
    statusText: "",
    statusTips: ``,
    btnName: "",
    isLoading: false,
    authorityTips: false,
    loadingText: "Yoo-hoo! 数据加载中",
    showCavans: true,
    canClick: false,
    isMember: 0
  },
  onLoad: async function (options) {
    console.log(app.globalData)
    // 获取页面参数
    if (options) {
      this.setData({
        orderSource: options.orderSource || options.channel || 'banner'
      })
    }
    // 获取unionId
    try {
      await ExchangeModel.getUnionid()
    } catch (error) {
      this.setData({
        authorityTips: true,
        isLogin: false
      })
    }
    // 获取用户信息
    try {
      const res = await ExchangeModel.getUserInfoByUnionId()
      const _res = res ? res.result : {}
      console.log("user info >>>", _res)
      if (_res) {
        this.setData({
          isMember: _res.isMember ? _res.isMember : ""
        })
      }
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
    } catch (error) {
      this.setData({
        authorityTips: true,
        isLogin: false
      })
    }
  },
  onReady: function () {
    this.mcaptcha = new Mcaptcha({
      el: "canvas",
      width: 100,
      height: 44,
      createCodeImg: ""
    });
  },
  closeStatusPop() {
    this.setData({
      showStatusPop: false,
      exchangeCode: "",
      imgCode: "",
      showCavans: true
    })
    this.refreshImgCode()
  },
  popCick() {
    if (this.data.statusCode != 1) {
      this.closeStatusPop()
    } else {
      if (this.data.canClick) {
        wx.redirectTo({
          url: '/mine/coupon/coupon'
        });
      }
    }
  },
  stop() {},
  exchangeNow() {
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
    if (!this.data.isAgree) {
      wx.showToast({
        title: '您未同意协议内容',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    if (this.data.isMember == 1) {
      wx.showToast({
        title: '您已经是会员了',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    if (this.data.exchangeCode == "") {
      wx.showToast({
        title: '请输入卡券号',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    // 验证验证码
    var res = this.mcaptcha.validate(this.data.imgCode);
    if (this.data.imgCode == "" || this.data.imgCode == null) {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    if (!res) {
      wx.showToast({
        title: '验证码输入错误，请重新输入',
        icon: 'none',
        mask: true,
        duration: 2000,
        authorityTips: false,

      })
      return;
    }
    this.setData({
      isLoading: true,
      loadingText: "Yoo-hoo! 正在为您兑换"
    })
    let params = {
      mobileNo: app.globalData.userInfo.mobileNo,
      exchangeCode: this.data.exchangeCode,
      unionId: app.globalData.unionid
    }
    let _this = this
    app.globalData.mta.Event.stat('c_mtq_member', {
      'btnsuccess': 'true'
    })
    wx.request({
      url: apiSettings.verification,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log("exchange >>", res)
        let _res = res.data
        // wx.hideLoading();
        let statusText = "",
          statusTips = "",
          btnName = "",
          code = 0,
          orderNo= ""
        switch (_res.code) {
          case 200:
            statusText = "恭喜您成为鲜檬会员"
            statusTips = `<p class="p" style="font-size: 13px; color: #666666;">稍后会有<span style="color: #FF6F08;">3张</span>卡券发至您的账号中</p>`
            btnName = "立即使用"
            code = 1
            orderNo = _res.result
            app.globalData.mta.Event.stat('c_mtq_member', {
              'btnexchange': 'true'
            })
            // 获取微信卡券列表的数据
            wx.request({
              url: apiSettings.Host + apiSettings.getWxCardParam + "?unionId=" + app.globalData.unionid,
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: res => {
                console.log(res.data)
                let _res = res.data.result ? res.data.result : {},
                  cardExt = {
                    "code": _res.code ? _res.code : "",
                    "openid": _res.openid ? _res.openid : "",
                    "timestamp": _res.timestamp ? _res.timestamp + "" : "",
                    "nonce_str": _res.nonce_str ? _res.nonce_str : "",
                    "signature": _res.signature ? _res.signature : ""
                  }
                wx.addCard({
                  cardList: [{
                    "cardExt": JSON.stringify(cardExt),
                    "cardId": _res.cardId
                  }],
                  success(res) {
                    _this.setData({
                      canClick: true
                    })   
                    console.log("卡券成功>>", res) // 卡券添加结果
                    // 记录用户领券的卡券
                    wx.request({
                      url: apiSettings.Host + apiSettings.updateWxCard + "?unionId=" + app.globalData.unionid,
                      method: 'POST',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success: res => {
                        console.log(res)
                      },
                      fail: err => {
                        console.log(err)
                      }
                    })
                  },
                  fail(err) {
                    _this.setData({
                      canClick: true
                    })                    
                    console.log("卡券失败>>", err, orderNo)
                    wx.showToast({
                      title: '若卡券领券失败，您可联系客服重新获取',
                      icon: 'none',
                      duration: 2000,
                      mask: true
                    });
                  }
                })
              },
              fail: err => {
                console.log(err)
                _this.setData({
                  canClick: true
                }) 
              }
            })
            break;
          case 500:
            statusText = "兑换失败"
            statusTips = `<p class="p" style="font-size: 13px; color: #666666;">${_res.message}</p>`
            btnName = "知道了"
            code = 2
            break;
          case 501:
            statusText = "暂停兑换"
            statusTips = `<p class="p" style="font-size: 13px; color: #666666;">${_res.message}</p>`
            btnName = "知道了"
            code = 3
            break;
          default:
            statusText = "兑换失败"
            statusTips = `<p class="p" style="font-size: 13px; color: #666666;">请稍后重试或联系客服为您处理</p>`
            btnName = "知道了"
            code = 2
            break;
        }
        this.setData({
          showStatusPop: true,
          statusCode: code,
          statusText: statusText,
          statusTips: statusTips,
          btnName: btnName,
          isLoading: false,
          showCavans: false
        })
      },
      fail: (err) => {
        console.log("exchange err >>", err)
      },
      complete: () => {}
    });
  },
  // 获取优惠券码
  bindCouponInput(e) {
    let value = e.detail.value
    this.setData({
      exchangeCode: value
    })
  },
  // 获取图形验证码
  bindCaptchaInput(e) {
    let value = e.detail.value
    this.setData({
      imgCode: value
    })
  },
  // 刷新验证码
  refreshImgCode() {
    this.mcaptcha.refresh();
  },
  // 查看协议
  showProtocol() {
    if (this.data.showProtocolPop) {
      this.setData({
        showProtocolPop: false,
        showCavans: true
      })
    } else {
      this.setData({
        showProtocolPop: true,
        showCavans: false
      })
    }
  },
  // 同意协议
  userAgree() {
    if (this.data.isAgree) {
      this.setData({
        isAgree: false
      })
    } else {
      this.setData({
        isAgree: true
      })
    }
  },
  /**
   * 授权登录
   * @param {Object} e 微信授权信息
   */
  onGotUserInfo(e) {
    console.log(e)
    ExchangeModel.updateUserInfo(e).then((res) => {
      console.log(res)
      this.setData({
        authorityTips: false,
        isLogin: true
      })
      if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
        this.setData({
          getPhone: true
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
    console.log(e)
    this.setData({
      loadingText: "Yoo-hoo! 数据加载中",
      isLoading: true
    })
    ExchangeModel.getUnionid().then(() => {
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
            wx.showToast({
              title: '获取手机号失败，请重试',
              icon: 'none'
            })
            return
          }
          app.globalData.userInfo.mobileNo = res.data.result.phoneNumber
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
              this.setData({
                getPhone: false
              })
              setTimeout(() => {
                this.setData({
                  isLoading: false
                })
              }, 1000)
            }
          })
        }
      })
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  onTabItemTap: function (item) {

  }
});
