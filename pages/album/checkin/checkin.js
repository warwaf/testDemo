import {
  Checkin
} from './checkin-model.js'
import {
  Home
} from '../home/home-model.js'
import {
  Setting
} from '../setting/setting-model.js'
import util from "../../../utils/util"
var settingModel = new Setting()
const checkinModel = new Checkin()
const homeModel = new Home()
const app = getApp()

var rooms = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomInfo: [],
    curMenuIndex: 0,
    // 空相册
    isEmpty: false,
    navigateBlock: 0,
    currentScrollTop: 0,
    navigationAction: false,
    animation: '',
    searchTop: 'searchTop',
    move: 'down',
    navigateText: 'false',
    bg: 'down',
    isIPX: app.globalData.isIPX,
    navigationHeight: app.globalData.navigationHeight,
    neverCreate: true,
    height: wx.getSystemInfoSync().screenHeight + 'px',
    upTimer: 0,
    downTimer: 0,
    //分页
    pageNo: 1,
    pageSize: 15,
    isLoading: true,
    isFinished: false,
    maskStat: false,
    //新手指引
    guidance: false,
    anonymous: false,
    //广告
    adList: [],
    currentSwiper: 0,
    statusBarHeight: 20,
    isSignIn: false,
    signInState: 0,
    signInInfo: {
      date: []
    },
    prize: 0.00,
    //拉新活动
    fromWeb: false,
    collectGuide: true,
    roomTypes: [],
    showWelcome: false,
    showTestM: false,
    showTime: "2020/12/31 23:59:59", // 霸屏页开始展示时间
    // showTime: "2020/12/29 10:10:10", // 霸屏页开始展示时间
    endTime:'2021/01/05 23:59:59',// 元旦活动结束时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    // util.sharePyq()//分享朋友圈
    this.setData({
      navigateBlock: app.globalData.navigateBlock,
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
      fromWeb: app.globalData.returnUrl ? app.globalData.returnUrl : false
    })
    let currentTime = this.dateGetTime(util.formatTime1(new Date()).replace(/-/ig, "/"))
    let startTime = this.dateGetTime(this.data.showTime) //活动开始时间
    let endTime = this.dateGetTime(this.data.endTime)
    if(currentTime<endTime && currentTime>startTime){
      app.globalData.newYearActOver = true
      wx.navigateTo({
          url: '/pages/activity/guide/index',
      })
    }
    // wx.hideShareMenu();

    checkinModel.getAds().then(res => {
      this.setData({
        adList: res.result
      })
    })

    //如果已经创建过房间就不显示动画了
    if (wx.getStorageSync('firstCreateAlbum')) {
      this.setData({
        neverCreate: false
      })
    }

    //收藏提示
    if (wx.getStorageSync('collectGuide')) {
      this.setData({
        collectGuide: false
      })
    }

    if (app.globalData.fromLogin) {
      app.globalData.fromLogin = false
      var appConfig = await checkinModel.getAppConfig()
      this.setData({
        roomTypes: appConfig.roomTypes,
        showWelcome: true
      })
    }
  },

  async onShow() {
    //从退出房间页面返回，直接从列表中删除，不刷新列表
    if (app.globalData.isQuit) {
      var roomInfo = this.data.roomInfo
      roomInfo.forEach((item, index) => {
        if (item.activityId == app.globalData.activityInfo.activityId) {
          roomInfo.splice(index, 1)
        }
      })
      this.setData({
        roomInfo
      })
      app.globalData.isQuit = false
      return
    }
    this.setData({
      fromWeb: app.globalData.returnUrl ? app.globalData.returnUrl : false,
      albumTypes: Boolean(app.globalData.fromLive)
    })
    app.globalData.fromLive = false
    this.initPage()
  },

  async initPage() {
    //刷新列表
    this.data.pageNo = 1

    try {
      await checkinModel.getUnionid()
    } catch (error) {
      return this.setData({
        anonymous: true,
        isLoading: false
      })
    }

    try {
      await homeModel.getUserPhoneByUnionId()
    } catch (error) {
      return this.setData({
        anonymous: true,
        isLoading: false
      })
    }

    //新手指引
    // if(!wx.getStorageSync('guidance-checkin')){
    //     //隐藏Tab
    //     setTimeout(() => {
    //         this.getTabBar().hide()
    //     },500)
    //     this.setData({
    //         guidance: 1
    //     })
    //     wx.setStorageSync('guidance-checkin', 1);
    // }

    var res = await checkinModel.gethistoryInfo(this.data.pageNo, this.data.pageSize, this.data.curMenuIndex)
    // var list = res.result.beautyRoom.concat(res.result.normalRoom)
    var list = res.result.list
    this.setData({
      roomInfo: list,
      isEmpty: list.length == 0,
      isFinished: list.length < this.data.pageSize,
      pageNo: this.data.pageNo + 1,
      isLoading: false,
      anonymous: false,
    })

    // if(!app.globalData.isSignIn){
    // 签到
    // checkinModel.getPrizeList().then(res=>{
    //     this.setData({
    //         signInInfo:res.result,
    //         isSignIn: res.result.state == 0 && res.result.signInState == 0 ? true : false
    //     })
    //     app.globalData.isSignIn = true;
    //     if(res.result.state == 0) this.getTabBar().hide();
    // });
    // }

    //获取当天0点时间戳
    var todayStart = new Date(new Date().toLocaleDateString()).getTime()
    if (!wx.getStorageSync('coupon') || parseInt(wx.getStorageSync('coupon')) < todayStart) {
      this.setData({
        maskStat: true
      })
    }
    this.debugFun()
  },
  /**
   * 调试时使用的方法
   */
  debugFun() {
    // 以下代码为测试debug使用，不在正式环境生效 start
    // 获取小程序ID
    if (__wxConfig.accountInfo.appId == 'wx5030c4b2c3c30e86') {
      // 可使用功能的用户的unionid
      let arr = ["oYnHqs3FBdLwZwj6B_99jV1Pc86Q", "oYnHqszJdK8gzKciXEX7r4GE4rzs"]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == app.globalData.unionid) {
          this.setData({
            showTestM: true
          })
          break
        }
      }
    }
    // 以上代码为测试debug使用，不在正式环境生效 end
  },
  dateGetTime(date) {
    return new Date(date).getTime()
  },
  toTest(e) {
    console.log("toTest >>", e)
    let {code, item} = e.currentTarget.dataset
    switch (code) {
      case 'exchange':
        wx.navigateTo({
          url: "/mine/member/exchange/exchange"
        })
        break;
      case 'skilling':
        wx.navigateTo({
          url: "/pages/activity/photographyActivity/index"
        })
        break;
      case 'bd':
        wx.navigateTo({
          url: `/activity/BDSendCoupon/index?id=${item+1}&c=test`
        })
        break;
      case "tpA":
        wx.navigateTo({
          url: '/activity/tpLive/live',
        })
        break;
      case "schedul":
        wx.navigateTo({
          url: '/pages/activity/scheduling/scheduling',
        })
        break;
      default:
        wx.navigateTo({
          url: "/activity/member/member"
        })
        break;
    }
  },

  // 签到
  async tapSignIn() {

    const res = await checkinModel.getSignIn();
    if (res.code == 200) {
      if (res.result.prize) {
        this.setData({
          signInState: 1,
          prize: res.result.prize
        })
      } else {
        this.colseRed({
          target: {
            dataset: {
              mask: 1
            }
          }
        })
      }

    }
  },
  // 打开红包
  openRed() {
    this.setData({
      signInState: 2
    })
  },
  // 关闭红包
  colseRed(e) {
    const {
      mask
    } = e.target.dataset;
    if (!mask) return;
    this.setData({
      isSignIn: false,
      signInState: 0
    })
    // 显示 tab
    setTimeout(() => {
      this.getTabBar().show();
    }, 500)
  },

  search() {
    wx.navigateTo({
      url: '../searchalbum/searchalbum',
    })
  },
  scroll(e) {
    const {
      scrollTop,
      scrollHeight
    } = e.detail;
    const {
      currentScrollTop,
      height
    } = this.data;
    if (scrollTop > currentScrollTop) {
      if (scrollTop <= 0) {
        this.getTabBar().show();
        clearTimeout(this.upTimer);
      } else {
        this.upTimer = setTimeout(() => {
          this.getTabBar().hide();
        }, 10);
        clearTimeout(this.downTimer)
      }
    } else {
      if (scrollTop >= scrollHeight - parseInt(height)) {
        this.getTabBar().hide();
        clearTimeout(this.downTimer)
      } else {
        this.downTimer = setTimeout(() => {
          this.getTabBar().show();
        }, 10);
        clearTimeout(this.upTimer)
      }

    }
    setTimeout(() => {
      this.setData({
        currentScrollTop: scrollTop
      })
    }, 100)

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(function () {
      this.getTabBar().show();
      delete this.timeoutId;
    }.bind(this), 500);
  },
  /**
   * 创建相册
   */
  createImg: function (e) {
    // wx.requestSubscribeMessage({
    //     tmplIds: ['88GlJBArDKeeCjUZUPdCYb11oTqx5Bu6rSh7SW5uS14'],
    //     complete: () => {
    //         this.setData({
    //             albumTypes: true
    //         })
    //     }
    // })
    this.setData({
      albumTypes: true
    })
    // checkinModel.collectFormId(e.detail.formId)
  },
  closeCreateAlbum() {
    this.setData({
      albumTypes: false
    })
  },
  toCreateAlbum(e) {
    wx.setStorageSync('firstCreateAlbum', true)
    this.setData({
      albumTypes: false
    })
    var type = e.currentTarget.dataset.type
    var data = {
      activityName: type == 1 ? '活动相册' : '私人相册',
      activityType: type == 1 ? '活动相册' : '私人相册',
      startTime: '2019-01-01 00:00:00',
      endTime: '2019-12-30 00:00:00',
      unionId: app.globalData.unionid,
      powerType: 1,
      activityStyle: type == 1 ? 10 : 0
    }
    wx.showLoading()
    settingModel.createActivityRoom(data).then(res => {
      app.globalData.roomInfo.room_no = res.result.activityId
      homeModel.addRecord().then(() => {
        wx.hideLoading()
        if (res.code == 200) {
          wx.navigateTo({
            url: `/pages/album/home/home?room_no=${res.result.activityId}&fromCreate=1`,
          })
        }
      })
    })

    // wx.navigateTo({
    //     url: '../create/create?type=' + e.currentTarget.dataset.type,
    // })
  },
  /**
   * 搜索相册
   */
  searchalbum: function (e) {
    wx.navigateTo({
      url: '../searchalbum/searchalbum',
    })
  },
  /**
   * 扫描
   */
  scan: function () {
    wx.scanCode({
      success: res => {
        console.log(res)
        wx.redirectTo({
          url: res.path
        })
      }
    })
  },
  toAr() {
    wx.navigateTo({
      url: '/pages/common/ar/ar',
    })
  },
  /**
   * to room
   */
  jump: function (event) {
    /**
     * 房间类型枚举
     * 0：活动
     * 1：看美照
     * 2：普通
     * 7：形象照
     * 8：电商
     * 9：毕业季
     * 10：智慧相册
     * 11：软订单
     * 12：硬订单
     * 13: 2020-12-24 活动
     */
    //新手指引下关闭新手指引
    if (this.data.guidance) {
      this.setData({
        guidance: false
      })
      return
    }
    var room = event.currentTarget.dataset['room'];
    //typeId 用于区分是否为看美照房间

    if (room.typeId == 1) {
      wx.navigateTo({
        url: `/pages/album/beauty/home?room_no=${room.activityId}&typeId=${room.typeId}`,
      })
    } else if (room.typeId == 10) {
      wx.navigateTo({
        url: `/pages/album/beauty2/beauty2?room_no=${room.activityId}&typeId=${room.typeId}`,
      })
    } else if (room.typeId == 11 || room.typeId == 12) {
      // @param {Number} typeId 11：软订单  12：硬订单
      wx.navigateTo({
        url: `/pages/album/newBeauty/newBeauty?room_no=${room.activityId}&typeId=${room.typeId}`,
      })
    } else if(room.typeId == 13) { // new 13 2020-12-24 活动
      console.log(room.activityId, room.typeId, room.activityName, '==================b')
      wx.navigateTo({
        url: `/pages/album/activity/activity?room_no=${room.activityId}&typeId=${room.typeId}&activityName=${room.activityName}`,
      })	
    } else {
        wx.navigateTo({
          url: `/pages/album/home/home?room_no=${room.activityId}&typeId=${room.typeId}`,
        })
    }
  },

  loadList: function () {
    if (this.data.isFinished) return
    this.setData({
      isLoading: true
    })

    checkinModel.gethistoryInfo(this.data.pageNo, this.data.pageSize, this.data.curMenuIndex).then(res => {
      // var list = [...this.data.roomInfo, ...res.result.normalRoom]
      var list = [...this.data.roomInfo, ...res.result.list]
      this.setData({
        roomInfo: list,
        pageNo: this.data.pageNo + 1,
        isFinished: list.length < this.data.pageSize,
        isLoading: false
      })
    })
  },

  hideMask() {
    wx.setStorageSync('coupon', Date.now())
    this.setData({
      maskStat: false
    })
  },
  toCoupon() {
    wx.navigateTo({
      url: '/pages/album/coupon/coupon',
    })
  },
  /**
   * 新手指导  下一步
   */
  nextStep() {
    if (this.data.guidance == 2) {
      //显示Tab
      setTimeout(() => {
        this.getTabBar().show()
      }, 500)
    }
    this.setData({
      guidance: this.data.guidance == 1 ? 2 : false
    })
  },

  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  toH5(e) {
    if (e.currentTarget.dataset.path.startsWith('http')) {
      wx.navigateTo({
        url: `/pages/webview/webview?path=${e.currentTarget.dataset.path}`
      });
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.path
      });
    }
  },

  userInfoEvent() {
    this.getTabBar().show()
    this.setData({
      anonymous: false
    })
    this.initPage()
  },

  userInfoEvent2() {
    wx.redirectTo({
      url: app.globalData.returnUrl
    })
    // checkinModel.saveInviteRecord(app.globalData.unionid, app.globalData.initiator, '普通')
  },

  giveUp() {
    this.setData({
      fromWeb: false
    })
  },

  onReachBottom() {
    this.loadList()
  },

  collectGuideTap() {
    wx.setStorageSync('collectGuide', 1)
    this.setData({
      collectGuide: false
    })
  },

  switchMenu(e) {
    this.setData({
      isLoading: true,
      isFinished: false,
      curMenuIndex: e.currentTarget.dataset.index,
      roomInfo: [],
      pageNo: 1
    }, async () => {
      var res = await checkinModel.gethistoryInfo(this.data.pageNo, this.data.pageSize, this.data.curMenuIndex)
      // var list = res.result.beautyRoom.concat(res.result.normalRoom)
      var list = res.result.list
      this.setData({
        roomInfo: list,
        isEmpty: list.length == 0,
        isFinished: list.length < this.data.pageSize,
        pageNo: this.data.pageNo + 1,
        isLoading: false
      })
    })

  },

  closeWelcome() {
    this.setData({
      showWelcome: false
    })
  },

  stop() {
    return false
  },
  /**
   * 用户点击右上角分享 
   */
  onShareAppMessage: function () {
    // const { isSpecial } = this.data

    // // 普通分享
    // console.log(`/pages/album/checkin/checkin?fromShare=1&special=${isSpecial ? 1 : null}&discoverId=${app.globalData.globalStoreId}`);

    // return {
    //     title: discoverInfo.name,
    //     path: `/pages/album/checkin/checkin?fromShare=1&special=${isSpecial ? 1 : null}&discoverId=${app.globalData.globalStoreId}`,
    //     imageUrl: discoverInfo.banner
    // }
  },
})