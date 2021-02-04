import ActivityModel from '../activity-model'
import {
  MemberModel
} from './member-model'
import apiSettings from '../../utils/ApiSetting'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorityTips: false,
    isAgree: true,
    isLogin: false,
    showCall: false,
    isLoading: false,
    orderSource: "",
    getPhone: false,
    isMember: "",
    showProtocolPop: false,
    loadingStatus: false,
    bgImgList: [],
    tabCode: "",
    openingStatus: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    app.globalData.mta.Event.stat('c_mtq_activity_member', {
      'channel': options.channel + `-${options.tabcode ? options.tabcode : ""}`
    })
    // 获取页面参数
    if (options) {
      let pageTitle = options.tabcode == 'gold' ? '开通金卡会员' : options.tabcode == 'silver' ? '开通银卡会员' : ''
      wx.setNavigationBarTitle({
        title: pageTitle
      });
      this.setData({
        orderSource: options.orderSource || options.channel || 'banner',
        tabCode: options.tabcode
      })
    }
    switch (options.tabcode) {
      case "gold":
        this.setData({
          bgImgList: [
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_bg1.png",
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_bg2.png",
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/bg/gold_bg3.png",
            // "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_bg4.png",
          ]
        })
        break;
      case "silver":
        this.setData({
          bgImgList: [
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_bg1.png",
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_bg2.png",
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_bg3.png",
            "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_bg4.png",
          ]
        })
        break;
      default:
        wx.showToast({
          title: '请从正确的入口进入',
          icon: 'none',
          duration: 2000,
          mask: true,
          complete: () => {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/album/checkin/checkin'
              });
            }, 2000)
          }
        });
        break;
    }
    // 获取unionId
    try {
      await ActivityModel.getUnionid()
    } catch (error) {
      this.setData({
        authorityTips: true,
        isLogin: false
      })
    }
    // 获取用户信息

    try {
      const res = await ActivityModel.getUserInfoByUnionId()
      const _res = res ? res.result : {}
      console.log("user info >>>", _res)
      if (_res) {
        this.setData({
          userInfo: _res,
          isMember: _res.isMember ? _res.isMember : ""
        })
        app.globalData.userInfo = _res
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
    this.checkMemberStatus()
  },
  onShow: function () {
    // this.setData({
    //   isMember: app.globalData.userInfo.isMember ? app.globalData.userInfo.isMember : ""
    // })
    this.checkMemberStatus()
  },
  // 检测会员购买情况
  checkMemberStatus() {
    let openingStatus = 0 // 初始值 - 金卡、银卡均未开通
    // 只开通了金卡
    if (this.data.userInfo.isMember == 1 && this.data.userInfo.silverMember == 0) {
      openingStatus = 1
    }
    // 只开通了银卡
    if (this.data.userInfo.isMember == 0 && this.data.userInfo.silverMember == 1) {
      openingStatus = 2
    }
    // 开通了金卡和银卡
    if (this.data.userInfo.isMember == 1 && this.data.userInfo.silverMember == 1) {
      openingStatus = 3
    }
    console.log("openingStatus: ", openingStatus)
    this.setData({
      openingStatus
    })
  },
  // 去兑换会员
  toExchange() {
    wx.redirectTo({
      url: '/mine/member/exchange/exchange'
    })
  },
  /**
   * 立即购买 - 创建订单
   */
  buyNow() {
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
    if (this.data.openingStatus == 3 || (this.data.tabCode == 'gold' && this.data.openingStatus == 1) || (this.data.tabCode == 'silver' && this.data.openingStatus == 2)) {
      return wx.navigateTo({
        url: `/mine/member/equity/equity?tabcode=${this.data.tabCode}`
      })
    }
    // 未同意协议判读
    if (!this.data.isAgree) {
      return wx.showToast({
        title: '您未同意协议内容',
        icon: 'none',
        duration: 1500
      })
    }

    let params = {
      "orderSource": this.data.orderSource,
      "unionId": app.globalData.unionid,
      "memberType": this.data.tabCode == "gold" ? 0 : 1
    }
    app.globalData.mta.Event.stat('c_mtq_activity_member', {
      'buy': 'true' + `-${this.data.tabCode ? this.data.tabCode : ""}`
    })
    this.setData({
      isLoading: true
    })
    // 创建订单
    MemberModel.createOrder(params).then(res => {
      if (res.code == 200) {
        this.setData({
          isLoading: false
        })
        wx.redirectTo({
          url: `/pages/album/diy/pay/pay?order_no=${res.result.OrderNo}&amount=${res.result.OrderPrice}&come=member&tabcode=${this.data.tabCode}`
        })
      } else {
        this.setData({
          isLoading: false
        })
        wx.showToast({
          title: '创建订单失败',
          icon: 'none',
          duration: 1500,
          mask: false
        })
      }
    }).catch(err => {
      this.setData({
        isLoading: false
      })
      wx.showToast({
        title: '创建订单失败',
        icon: 'none',
        duration: 1500,
        mask: false
      })
    })
  },
  /**
   * 同意协议
   */
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
   * 唤起拨号页
   */
  callPhone() {
    app.globalData.mta.Event.stat('c_mtq_activity_member', {
      'service': 'true' + `-${this.data.tabCode ? this.data.tabCode : ""}`
    })
    wx.makePhoneCall({
      phoneNumber: '4008052189'
    })
  },
  /**
   * 控制客服弹窗
   */
  showCallPhone() {
    if (this.data.showCall) {
      this.setData({
        showCall: false
      })
    } else {
      app.globalData.mta.Event.stat('c_mtq_activity_member', {
        'outservice': 'true' + `-${this.data.tabCode ? this.data.tabCode : ""}`
      })
      this.setData({
        showCall: true
      })
    }
  },
  /**
   * 查看协议
   */
  showProtocol() {
    if (this.data.showProtocolPop) {
      this.setData({
        showProtocolPop: false
      })
    } else {
      this.setData({
        showProtocolPop: true
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
      if (!app.globalData.userInfo.mobileNo || app.globalData.userInfo.mobileNo == "") {
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
            wx.showToast({
              title: '获取手机号失败，请重试',
              icon: 'none'
            })
            this.setData({
              loadingStatus: false
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
                getPhone: false,
                loadingStatus: false
              })
              // wx.request({
              //   url: apiSettings.Host + apiSettings.GetUserPhoneByUnionId,
              //   method: 'POST',
              //   header: {
              //     "Content-Type": "application/x-www-form-urlencoded"
              //   },
              //   data: {
              //     openid: app.globalData.unionid
              //   },
              //   success: userinfo => {
              //     if (userinfo.data.result) {
              //       app.globalData.userInfo = userinfo.data.result
              //       this.setData({
              //         getPhone: false
              //       })
              //     }
              //     this.triggerEvent('confirmEvent', {})
              //   }
              // })
            }
          })
        }
      })
    })
  },
  /**
   * 去首页
   */
  toHome() {
    wx.switchTab({
      url: '/pages/album/checkin/checkin'
    })
  },
  stop() {
    return false
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let imgUrl = ``
    switch (this.data.tabCode) {
      case "gold":
        imgUrl = "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/gold_bg1.png"
        break;
      case "silver":
          imgUrl = "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/silver_bg1.png"
          break;
      default:
        break;
    }
    return {
      title: '鲜檬会员火热招募中',
      path: `/activity/member/member?tabcode=${this.data.tabCode ? this.data.tabCode : ''}`,
      imageUrl: imgUrl
    }
  },
})