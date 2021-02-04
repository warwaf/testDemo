// pages/activity/seckilling/index.vue.js
var Mcaptcha = require("../../../utils/mcaptcha.js")
import apiSettings from '../../../utils/ApiSetting.js'
import util from '../../../utils/util.js'
var app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    isMargin: `margin-top:${app.globalData.navHeight+40}px`,
    isMargin1: `margin-top:${app.globalData.navHeight}px`,
    isAnnouncement: false,
    isLoading: false,
    navTop: app.globalData.navHeight,
    stateInQueue: false,
    startData: '',
    timeLeft: {},
    timer: '',
    text: '', //固定信息
    clerTime: '',
    InitDataClear: '',
    isVerification: false, //验证弹窗
    imgCode: '', //输入的验证码
    state: '', //状态
    date: '', //时间
    unionId: '',
    arr: [
      '恭喜132****0430获得0元三亚婚纱旅拍名额',
      '恭喜159****9234获得0元三亚婚纱旅拍名额',
      '恭喜188****9932获得0元三亚婚纱旅拍名额',
      '恭喜158****2390获得0元三亚婚纱旅拍名额',
      '恭喜135****9249获得0元三亚婚纱旅拍名额',
      '恭喜131****0145获得0元三亚婚纱旅拍名额',
      '恭喜152****5642获得0元三亚婚纱旅拍名额',
      '恭喜157****8854获得0元三亚婚纱旅拍名额',
      '恭喜156****5238获得0元三亚婚纱旅拍名额',
      '恭喜158****1158获得0元三亚婚纱旅拍名额',
      '恭喜132****8894获得0元三亚婚纱旅拍名额',
    ],
    space: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 30, // 时间间隔
    isButton: true,
    setMeal: ['https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/setMeal1.jpg', 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/setMeal2.jpg', 'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/setMeal3.jpg'],
    animatic1: [
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample1.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample2.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample3.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample4.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample5.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample6.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample7.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample8.jpg',
      'https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/20200811/rushSample9.jpg',
    ],
    mtaInfo: {
      name: "c_mtq_activity_seckill"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'pageseckill': app.globalData.actChannel
    })
    // 公告间隔
    this.setData({
      text: this.data.arr.join(this.data.space)
    })
    var that = this;
    var length = that.data.text.length * that.data.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt(); // 第一个字消失后立即从右边出现
    // 验证码
    var that = this;
    this.setData({
      isLoading: true
    })
  },
  // 排队中
  stateInQueueImg() {
    this.setData({
      stateInQueue: false
    })
  },
  getAnnouncement() {
    console.log(Date.parse(new Date()), 'Date.parse(new Date())')
    if (Date.parse(new Date()) > Date.parse('2020/08/25 14:00:30')) {
      this.setData({
        isAnnouncement: true
      })
    }
  },
  // 初始化数据
  getInitData() {
    this.getAnnouncement()
    wx.request({
      url: apiSettings.getActivityInit,
      data: {
        unionId: app.globalData.unionid,
        activityId: app.globalData.actId ? app.globalData.actId : '',
      },
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: data => {
        if (data.data.code == 200) {
          this.setData({
            isLoading: false,
            state: data.data.result.state,
            date: data.data.result.date,
            unionId: data.data.result.unionId
          })
          if (data.data.result.state == 6) {
            this.setData({
              // stateInQueue: true,
              isVerification: false
            })
          } else if (data.data.result.state == 4) {
            //获取当前时间戳  
            this.startData = data.data.result.startTime
            var _this = this
            _this.data.timer = setInterval(() => { //注意箭头函数！！
              var strTime = Date.parse(new Date(this.data.date)) + 1000
              console.log(util.getTimeLeft(this.startData, this.data.date), 'data<<<')
              this.setData({
                date: util.js_date_time(strTime)
              })
              _this.setData({
                timeLeft: util.getTimeLeft(this.startData, this.data.date), //使用了util.getTimeLeft
              });
              if (_this.data.timeLeft.text == "00天00时00分00秒") {
                clearInterval(_this.data.timer);
                this.setData({
                  state: 7,
                })
              }
            }, 1000);
          }
        } else if (data.data.code == 500) {
          wx.showToast({
            title: data.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  // 输入验证
  bindInput(e) {
    this.setData({
      imgCode: e.detail.value
    })
  },
  //刷新验证码
  onTap() {
    this.mcaptcha.refresh(1);
  },
  // 点击提交
  fnvavidate: function () {
    //验证验证码
    var _this = this
    var res = _this.mcaptcha.validate(_this.data.imgCode);
    if (_this.data.imgCode == '' || _this.data.imgCode == null) {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none'
      })
      return;
    }
    if (!res) {
      wx.showToast({
        title: '图形验证码错误',
        icon: 'none'
      })
      return;
    }
    this.getAnnouncement()
    _this.setData({
      stateInQueue: true,
    })
    wx.request({
      url: apiSettings.getActivitysmt,
      data: {
        unionId: _this.data.unionId,
        activityId: app.globalData.actId ? app.globalData.actId : '',
        date: util.formatTime1(new Date()),
      },
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: data => {
        if (data.data.code == 503) {
          wx.showToast({
            title: '活动火爆中...,请重试!',
            icon: 'none',
          })
        }
        if (data.data.code == 200) {
          _this.setData({
            isVerification: false,
            stateInQueue: false,
          })
          if (data.data.result.state == 6) {
            _this.data.clerTime = setInterval(() => {
              wx.request({
                url: apiSettings.getActivityQuery,
                data: {
                  activityId: app.globalData.actId ? app.globalData.actId : '',
                  unionId: _this.data.unionId
                },
                header: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                success: item => {
                  if (item.data.code == 200) {
                    _this.setData({
                      stateInQueue: false,
                    })
                    if (item.data.result.state != 6) {
                      _this.setData({
                        isVerification: false,
                        state: item.data.result.state,
                        unionId: item.data.result.unionId,
                        date: item.data.result.date
                      })
                      clearInterval(_this.data.clerTime)
                      clearInterval(_this.data.timer);
                    }
                    if (item.data.result.state == 2) {
                      app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
                        'pagecoupon': app.globalData.actChannel
                      })
                      clearInterval(_this.data.timer);
                      clearInterval(_this.data.clerTime)
                    }
                  }
                }
              })
            }, 500);
          } else {
            _this.setData({
              isVerification: false,
              stateInQueue: false,
              state: data.data.result.state,
              unionId: data.data.result.unionId,
              date: data.data.result.date
            })
          }
        } else {
          _this.setData({
            isVerification: false,
            stateInQueue: false
          })
          wx.showToast({
            title: '系统时间不符合',
            icon: 'none',
          })
        }
      },
      fail(err) {
        this.setData({
          stateInQueue: false
        })
        wx.showToast({
          title: '请求抢购失败',
          icon: 'none',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 完善资料
  getDataPerfect() {
    clearInterval(this.data.timer);
    clearInterval(this.data.clerTime)
    wx.navigateTo({
      url: './dataPerfect/index?way=00',
    })
  },
  // 关闭验证窗口
  getImg() {
    this.setData({
      isVerification: false
    })
  },
  // 立即抢购
  getImmediatelyKill() {
    this.setData({
      imgCode: '',
    })
    if (this.data.state != 7 && this.data.state != 6) {
      return
    }
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'btnseckill': 'click'
    })
    app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
      'btnseckillid': app.globalData.unionid
    })
    this.setData({
      isVerification: true
    })
    this.mcaptcha = ''
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: 80,
      height: 40,
      createCodeImg: ""
    });
    this.mcaptcha.refresh(1);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInitData()
    this.checkSetting()
  },
  onHide: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.clerTime)
  },
  // 检测订阅权限
  checkSetting() {
    let _this = this
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res.authSetting)
        console.log(res.subscriptionsSetting)
        if (!res.subscriptionsSetting.mainSwitch) {
          _this.setData({
            openSetting: true
          })
        } else {
          _this.setData({
            openSetting: false
          })
          _this.getSeckillAlert()
        }
      }
    })
  },
  toOpenSet() {
    wx.showToast({
      title: '您未设置消息订阅',
      icon: 'none',
      duration: 1500,
      complete: () => {
        wx.openSetting({
          withSubscriptions:true,
          success(res) {
            console.log(res)
          }
        })
      }
    });
  },
  // 开启提醒
  getSeckillAlert() {
   let tmplIdList = ['QIfcsLHNT0zCF4RxvM4liiRNT8hsJr3g1_vsh33-MkU', 'mg2KS4K7BX-qJB8vcKNqeCU_bRO7q1dD6F9F-gHx1FY', '6EFCWFbBRAalXrN5VLA_WQtJ94glQvQ2uwc4H7gRls0']
    wx.requestSubscribeMessage({
      tmplIds: tmplIdList,
      success(res) {
        console.log("订阅 >>", res)
        let total = 0
        for (let i = 0; i < tmplIdList.length; i++) {
          if (res[tmplIdList[i]] == "reject") {
            total++
          }
        }
        console.log("total", total)
        if (total > 0) {
          wx.showToast({
            title: `您有${total}条消息未订阅`,
            icon: "none"
          })
        } else {
          wx.showToast({
            title: '订阅成功',
          })
        }
      },
      fail(err) {
        if (err.errCode == 20001) {
          wx.showToast({
            title: '模板ID不存在',
            icon: 'none',
          })
        }
      }
    })
  },
  // 滚动公告
  scrolltxt: function () {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        } else {
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    } else {
      that.setData({
        marquee_margin: "1000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.clerTime)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {},
  onPageScroll: function (e) {
    if (e.scrollTop > 400) {
      this.setData({
        isButton: false
      })
    } else {
      this.setData({
        isButton: true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '三亚鲜檬0元旅拍',
      path: `/pages/activity/photographyActivity/index?actId=${app.globalData.actId ? app.globalData.actId : ""}`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20200906/share-img.png"
    }
  }
})
