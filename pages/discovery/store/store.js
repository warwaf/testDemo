// import { Home } from '../../album/home/home-model.js'
import {
  List
} from '../list/list-model.js'
import {
  Index
} from '../index/index-model'
import {
  isLogin,
  delay,
  isRegistered
} from '../../../utils/util'
var listModel = new List()
var indexModel = new Index()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: [],
    photos: [],
    bannerUrl: '',
    manuStat: true,
    pageNum: 1,
    pageSize: 30,
    neverCreate: true,
    discoverId: 0,
    isEmpty: false,
    isSpecial: false,
    // 加载数据中
    isLoading: false,
    isShowCoupon: false,
    couponCode: null,
    isShowTools: '',
    isSearch: false,
    selectTab: 1,
    searchInput: '',
    // 如果类型是 C 并且创建动态成功 这显示参加活动成功
    isCreate: false,
    shareStat: false,
    fromShare: false,
    error: false,
    userInfo: {},
    showArrangeInfo: false,
    curStyle: '',

    isCall: false, // 控制电话咨询弹窗
    newInfo: 1, // 咨询信息结果 1：填写信息 0：
    waitingTips: false, // 控制温馨提示弹窗
    arrangeTime: "", // 预约时间
    totalPage: 0, // 商品列表总页数
    storeInfo: {}, // 获取门店信息
    styleList: [] // 获取风格列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("options >>", options)
    const {
      special,
      type,
      id,
      fromShare
    } = options;
    // if(id){
    //     try {
    //         let lev = 1;
    //         if(special == 1)  lev = 2;
    //         const res = await indexModel.listLevel(lev,1,1,id);
    //         if(res.code == 200) app.globalData.discoverInfo = res.result[0];
    //     } catch (error) {
    //         wx.showToast({
    //             title:'数据加载失败，请联系管理员',
    //             icon: 'none'
    //         })
    //     }
    // }
    const {
      unionid,
      discoverInfo
    } = app.globalData;



    this.setData({
      bannerUrl: discoverInfo ? discoverInfo.banner : "",
      discoverId: discoverInfo ? discoverInfo.storeId : "",
      isSpecial: Boolean(special),
      isShowTools: discoverInfo ? discoverInfo.type : '',
      isCreate: type == 'DGLG' ? true : false,
      discoverInfo,
      fromShare: fromShare ? true : false,
      storeId: id ? id : ""
    })
    // this.loadNewestData()        
    // 如果已经创建过活动就不显示动画了
    if (wx.getStorageSync('firstCreateActivity')) {
      this.setData({
        neverCreate: false
      })
    }

    // 查询优惠券信息
    // const { code, result } = await listModel.searchCouponInfo(discoverInfo.id, unionid);
    // if(code == 200 && result.showCoupon){
    //     this.setData({
    //         isShowCoupon:true,
    //         couponCode:result.coupon.couponCode
    //     })
    // }
  },
  // 关闭提示弹窗
  closeWaiting() {
    this.setData({
      waitingTips: false
    })
  },
  // 控制咨询弹窗
  controlCallPop(e) {
    console.log(e)
    let data = e.currentTarget.dataset
    if (data.code == '0') {
      this.setData({
        isCall: false
      })
      return
    }
    this.setData({
      isCall: true
    })
  },
  // 拨打按钮
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.storeInfo.mobileNo + "",
      complete: () => {
        this.setData({
          isCall: false
        })
      }
    })
  },
  /**
   * 返回
   */
  goHome(e) {
    app.globalData.fromShare = false
    wx.switchTab({
      url: '/pages/album/checkin/checkin',
    })
  },

  onReachBottom() {
    // this.loadNewestData();
    if (this.data.pageNum > this.data.totalPage) {
      this.setData({
        isLoading: false,
        isEmpty: false
      })
      return
    }
    // this.getStoreInfo()
    this.getProductsList()
  },
  /**
   * 鲜檬云相册v1.4弃用
   */
  loadNewestData() {
    this.setData({
      isLoading: true
    })
    listModel.getNewest(
      app.globalData.discoverInfo.id,
      this.data.pageNum,
      this.data.pageSize
    ).then(data => {
      if (data.result.length == 0 && this.data.pageNum == 1) {
        if (this.data.pageNum == 1) {
          this.setData({
            isEmpty: true,
            isLoading: false
          })
        } else {
          this.setData({
            isLoading: false
          })
        }
      } else {
        this.setData({
          // photo: this.data.photo.concat(data.result),
          isEmpty: false,
          isLoading: false
        })
      }
      this.data.pageNum++
    })
  },
  async getCoupon() {
    const res = await listModel.getCoupon({
      unionId: app.globalData.unionid,
      couponCode: this.data.couponCode
    });
    this.setData({
      isShowCoupon: false
    })
  },
  closeCoupon() {
    this.setData({
      isShowCoupon: false,
      isCreate: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!isLogin()) {
      return wx.navigateTo({
        url: '/pages/common/userPhone/userPhone'
      })
    }
    this.setData({
      pageNum: 1,
      photo: [],
      anonymous: JSON.stringify(app.globalData.userInfo) == '{}'
    })
    this.loadStyleList()
    this.getStoreInfo()
    this.getProductsList()
  },

  /**
   * 收起/打开banner
   */
  switchBannerStat: function (e) {
    var scrollTop = e.detail.scrollTop
    if (scrollTop > 200 && this.data.bannerStat) {
      this.setData({
        bannerStat: false
      })
    } else if (scrollTop <= 200 && !this.data.bannerStat) {
      this.setData({
        bannerStat: true
      })
    }
  },

  /**
   * 最热
   */
  toHotest() {
    wx.redirectTo({
      url: `/pages/discovery/hot/hot?special=${this.data.isSpecial ? 1 : ''}&type=${this.data.discoverInfo.type}`,
    })
  },

  /**
   * 最新
   */
  toNewest() {
    wx.redirectTo({
      url: `/pages/discovery/list/list?special=${this.data.isSpecial ? 1 : ''}`,
    })
  },
  /**
   * 返回
   */
  goback(e) {
    if (e.detail == 'goto') {
      wx.switchTab({
        url: '/pages/discovery/index/index',
      })
    }
  },

  onPageScroll: function (e) {
    if (e.scrollTop <= 200 && this.data.manuStat == false) {
      this.setData({
        manuStat: true
      })
    }
    if (e.scrollTop > 200 && this.data.manuStat == true) {
      this.setData({
        manuStat: false
      })
    }
  },

  /**
   * 发布动态
   */
  createDynamics: function () {
    if (this.data.anonymous) {
      return this.setData({
        authorityTips: true
      })
    }
    wx.navigateTo({
      url: '/pages/discovery/create-dynamics/create-dynamics?id=' + app.globalData.discoverInfo.id,
    })
  },
  /**
   * 获取门店信息
   */
  getStoreInfo() {
    let {
      discoverInfo,
      globalId
    } = app.globalData
    discoverInfo = discoverInfo ? discoverInfo : null
    let storeId = this.data.storeId ? this.data.storeId : discoverInfo ? discoverInfo.storeId : globalId ? globalId : ""
    indexModel.getStoreList("", "", app.globalData.unionid, storeId, "", "", "").then(res => {
      let storeinfo = res.result[0]
      this.setData({
        storeInfo: storeinfo,
        bannerUrl: storeinfo.banner,
        discoverInfo: storeinfo
      })
      //导航栏标题
      wx.setNavigationBarTitle({
        title: `${storeinfo.name}`
      })
    })
  },
  /**
   * 获取商品列表（新）
   */
  getProductsList() {
    let {
      discoverInfo,
      globalId
    } = app.globalData
    discoverInfo = discoverInfo ? discoverInfo : null
    let storeId = this.data.storeId ? this.data.storeId : discoverInfo ? discoverInfo.storeId : globalId ? globalId : ""
    this.setData({
      isLoading: true
    })
    listModel.getProductsList(storeId, this.data.pageNum, this.data.pageSize).then(res => {
      if (res.code == 200) {
        let _res = res.result,
          length = _res.list ? _res.list.length : 0
        this.setData({
          totalPage: _res.totalPage
        })
        if (length == 0 && this.data.pageNum == 1) {
          if (this.data.pageNum == 1) {
            this.setData({
              isEmpty: true,
              isLoading: false
            })
          } else {
            this.setData({
              isLoading: false
            })
          }
        } else {
          this.setData({
            photo: this.data.photo.concat(_res.list),
            isEmpty: false,
            isLoading: false
          })
        }
        this.data.pageNum++
      }
      if (this.data.photo.length > 0 && this.data.styleList.length > 0) {
        for (let i = 0; i < this.data.photo.length; i++) {
          for (let j = 0; j < this.data.styleList.length; j++) {
            if (this.data.photo[i].photographyType == this.data.styleList[j].theKey) {
              this.data.photo[i].styleName = this.data.styleList[j].theValue
              break;
            } else {
              this.data.photo[i].styleName = ""
            }
          }
        }
      }
      this.setData({
        photo: this.data.photo
      })
      console.log(JSON.parse(JSON.stringify(this.data.photo)))
    })
  },
  /**
   * 加载风格列表
   */
  async loadStyleList() {
    let res = await indexModel.getCommonProperties(),
      list = res.result
    this.setData({
      styleList: list
    })
  },
  /**
   * 马上预约
   */
  toArrange() {
    if (this.data.anonymous) {
      return this.setData({
        authorityTips: true
      })
    }

    if (!isLogin()) {
      wx.navigateTo({
        url: '/pages/common/userPhone/userPhone'
      })
      return
    }

    this.setData({
      userInfo: {
        ...app.globalData.userInfo
      },
      // showArrangeInfo: true
    })
    this.checkArrange()
    // wx.redirectTo({
    //     url: '/pages/discovery/arrange/arrange?id=' + app.globalData.discoverInfo.id,
    // })
  },

  hideArrangeInfo(e) {
    let data = e.currentTarget.dataset
    if (data.code == 0) {
      this.setData({
        newInfo: 1
      })
    }
    this.setData({
      showArrangeInfo: false
    })
  },

  modifyUserInfo(e) {
    this.data.userInfo[e.currentTarget.dataset.type] = e.detail.value
  },
  /**
   * 检测手机号
   */
  watchMobileNo(e) {
    let val = e.detail.value,
      reg = /[^0-9]/ig
    delay(() => {
      if (reg.test(val) && val.length > 0) {
        val = val.replace(/[^0-9]/ig, "")
        this.setData({
          'userInfo.mobileNo': val
        })
        wx.showToast({
          title: '手机号只能是数字',
          icon: "none"
        })
      } else {
        this.setData({
          'userInfo.mobileNo': val
        })
      }
    }, 500)
  },
  /**
   * 检测联系人
   */
  watchName: function (e) {
    let val = e.detail.value,
      reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
    delay(() => {
      if (!reg.test(val) && val.length > 0) {
        val = val.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, "")
        this.setData({
          'userInfo.nickName': val
        })
        wx.showToast({
          title: '联系人只能是中文、英文及数字',
          icon: "none"
        })
      } else {
        this.setData({
          'userInfo.nickName': val
        })
      }
    }, 500)
  },
  /**
   * 查询是否已咨询
   */
  checkArrange() {
    const {
      discoverInfo,
      unionid
    } = app.globalData;
    let storeId = discoverInfo ? discoverInfo.storeId : this.data.storeId,
      partNo = '',
      unionId = unionid
    indexModel.getCheckAppoiment(storeId, partNo, unionId).then(res => {
      if (res.result != null) {
        this.setData({
          waitingTips: true,
          arrangeTime: res.result.createTime
        })
      } else {
        this.setData({
          showArrangeInfo: true
        })
      }
    })
  },
  async confirmArrange(state) {
    wx.showLoading({
      mask: true
    })
    const res = await app.verifyContent(this.data.userInfo.nickName);
    if (res == false) {
      this.setErrorMessage('内容包含敏感词汇，请修改后重新提交')
      return
    }
    if (/[^a-zA-Z0-9\u4E00-\u9FA5]/g.test(this.data.userInfo.nickName) && this.data.userInfo.nickName.length > 0) {
      wx.showToast({
        title: "联系人只能是中文、英文及数字",
        icon: "none"
      })
      return
    }
    if (!(/(^[1][0-9][0-9]{9}$)/g.test(this.data.userInfo.mobileNo))) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none"
      })
      return
    }
    if (this.data.userInfo.nickName == "") {
      wx.showToast({
        title: "联系人不能为空",
        icon: "none"
      })
      return
    }
    if (this.data.userInfo.mobileNo == "") {
      wx.showToast({
        title: "手机号不能为空",
        icon: "none"
      })
      return
    }
    listModel.recordArrange(this.data.userInfo, this.data.discoverInfo.storeId).then(res => {
      wx.hideLoading()
      if (res.code == 201) {
        this.setData({
          waitingTips: true,
          showArrangeInfo: false
        })
        return
      }
      if (res.code == 200) {
        this.setData({
          newInfo: 0
        })
      } else {
        wx.showToast({
          title: "提交失败，请重试",
          icon: ""
        })
      }
    })
  },

  onGotUserInfo(e) {
    listModel.updateUserInfo(e).then(() => {
      this.setData({
        authorityTips: false,
        anonymous: false
      })
    })
  },

  hideAuthority() {
    this.setData({
      authorityTips: false
    })
  },
  /**
   * 点击 tools
   */
  tapTools(e) {
    const info = e.currentTarget.dataset.info;
    const {
      mta,
      discoverInfo,
      unionid
    } = app.globalData;
    let event = ''
    let baseUrl = '/activity/anniversary/anniversary'
    if (this.data.isShowTools == "DGLG") baseUrl = '/activity/engineering/engineering'
    if (info == 'entry') {
      event = 'c_mtq_Dynamics_Banner_Competition'
      wx.navigateTo({
        url: `${baseUrl}?type=${info}&id=${discoverInfo.id}`
      })
    } else if (info == 'ranking') {
      event = 'c_mtq_Dynamics_Banner_RankingList'
      wx.navigateTo({
        url: `${baseUrl}?position=1&type=${info}&id=${discoverInfo.id}`
      })
    } else if (info == 'prize') {
      event = 'c_mtq_Dynamics_Banner_Prizes'
      wx.navigateTo({
        url: `${baseUrl}?type=${info}&id=${discoverInfo.id}`
      })
    } else if (info == 'search') {
      event = 'c_mtq_Dynamics_Banner_Search'
      this.setData({
        isSearch: true,
        searchInput: ''
      })
    } else {
      // 分享
      this.setData({
        shareStat: true
      })
    }
    mta.Event.stat(event, {
      'activity': discoverInfo.id,
      count: unionid
    })
  },
  hideMask() {
    this.setData({
      shareStat: false
    })
  },
  downloadQrcode() {
    wx.showLoading({
      title: '下载中',
      mask: true
    })
    wx.downloadFile({
      url: "https://hcmtq.oss-accelerate.aliyuncs.com/SystemImg/30fxy.jpg",
      success: result => {
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: result.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功'
            })
          }
        })
      }
    });
  },
  /**
   * 
   */
  tapTabs(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectTab: index,
      searchInput: ''
    })
  },
  inputConfirm(e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  /**
   * 确认搜索
   */
  async popComfirm() {
    this.setData({
      isSearch: false
    })
    const {
      searchInput,
      selectTab
    } = this.data;
    wx.showLoading({
      title: '内容检测中'
    });
    const res = await listModel.verifyContent(searchInput);
    if (res == false) {
      this.setErrorMessage('搜索内容包含敏感词汇，请修改后重新提交')
      return
    }
    wx.hideLoading();
    let url = ''
    if (selectTab == 1) url = '/pages/discovery/list/search/search?competitionNo=' + searchInput
    if (selectTab == 2) url = '/pages/discovery/list/search/search?nickName=' + searchInput
    wx.navigateTo({
      url
    })
  },
  setErrorMessage(content) {
    wx.hideLoading();
    this.setData({
      error: true,
      msgText: content,
    })
  },
  cancle() {
    this.setData({
      error: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {
      discoverInfo,
      discoverId,
      isSpecial
    } = this.data
    // 东莞理工分享
    // if(discoverInfo.type == 'DGLG'){
    //     return {
    //         title:'第10届老马杯学生摄影十佳评选活动',
    //         path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1`,
    //         imageUrl:"https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/333608a25de642959ec4ea9e43a667ce.png"
    //     }
    // }

    // // 虎彩30周年分享
    // if(discoverInfo.type == 'C'){
    //     return {
    //         title:discoverInfo.name,
    //         path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1&special=${isSpecial ? 1 : null}`,
    //         imageUrl:"https://hcmtq.oss-accelerate.aliyuncs.com/SystemImg/30fx.jpg"
    //     }
    // }

    // // 普通分享
    // return {
    //     title: discoverInfo.name,
    //     path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1&special=${isSpecial ? 1 : null}`,
    //     imageUrl: discoverInfo.banner
    // }

    let storeId = app.globalData.globalId || app.globalData.discoverInfo.storeId
    // 普通分享
    console.log(`/pages/discovery/store/store?id=${storeId}&fromShare=1&special=${isSpecial ? 1 : null}&discoverId=${app.globalData.globalStoreId}`);

    return {
      title: this.data.storeInfo.name,
      path: `/pages/discovery/store/store?id=${storeId}&fromShare=1&special=${isSpecial ? 1 : null}&discoverId=${app.globalData.globalStoreId}`,
      imageUrl: this.data.storeInfo.banner
    }
  },


  /**
   * 跳转详情页
   */
  toDetail(event) {
    let item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `./detail/detail?id=${item.customerNo}&partNo=${item.partNo}`,
    })
  },
  bd09togcj02(bd_lon, bd_lat) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  },
  toMap() {
    var lat = app.globalData.discoverInfo.lat,
      lng = app.globalData.discoverInfo.lng,
      name = app.globalData.discoverInfo.name
    let location = this.bd09togcj02(lat, lng)
    wx.navigateTo({
      url: `/pages/common/map/map?lat=${location[0]}&lng=${location[1]}&name=${name}`
    })
  },
  stop() {
    return false
  }
})
