// pages/showAr/showAr.js
import ActivityModel from '../../activity-model'
import apiSettings from '../../../utils/ApiSetting.js'
import util from "../../../utils/util"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: (new Date(util.formatTime1(new Date()))).getTime(),
    sponsorAward: false,//发起人奖品
    isAutoplay: false,//是否自动播放
    videoId: '',//视频id
    videoUrl: '',//视频url
    dataDetail: [],//详情数据
    authorityTips: false,
    isLogin: false,
    isBindTheUser: true,//是否绑定了用户
    height: 0,
    url: '',
    meta: null,
    back: false,
    isLoading: false,//加载loading
    isOwn: true,
    isThumb: false,//邀请还是点赞
    participantList: [],
    arId: '',//活动id
    isShare: false,//分享弹出框
    activitySchedule: 0,//活动是否结束
    arType: ''//入口
  },
  // setShareButtonSwitch () { this.setData({ canIUseShareButton: my.canIUse('button.open-type.share') }) },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // util.sharePyq()//分享朋友圈
    app.globalData.mta.Event.stat('c_mtq_aractivity',{'visitplay':'true'})
    console.log(options, app,'options888')
    // 加载提示
    this.setData({
      isLoading: true,
      videoId: options.meta?decodeURIComponent(options.meta):'',
      videoUrl: options.meta?decodeURIComponent(options.meta):'',
      arType: options.arType?options.arType:'',
      arId: options.arId?options.arId:''
    })
    var src = this.base64_decode(this.data.videoUrl) // 'https://hcmtq.oss-accelerate.aliyuncs.com/AR/men/23/23.mp4 ' // this.base64_decode(options.meta)
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.statusBarHeight
        })
      }
    })
    // src = src.slice(0, -1) // 去除返回地址末尾的空格
    if (src.startsWith("http:")) {
      // http 改为 https
      src = src.replace("http:", "https:")
    }
    this.setData({
      videoUrl: src,
      back: getCurrentPages().length > 1 ? true : false
    }, () => {
      setTimeout(() => {
        // var context = wx.createVideoContext('myVideo', this)
        // context.play()
      }, 500);
    })

    //查询活动是否结束
    wx.request({
      url: apiSettings.getEndFlag,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: res=>{
        if (res.data.code == 200) {}
        this.setData({
          activitySchedule: res.data.result
        })
      }
    })
    
    // app.globalData.mta.Event.stat('c_mtq_aractivity',{'videoplay':'init'})
    // app.globalData.mta.Event.stat('c_mtq_aractivity',{'videoplay':'click'})
    // 
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage','shareTimeline'],
    // })


    //点赞列表信息
    // let arr = []
    // for (let i = 0; i < 6; i++) {
    //   if (i < 3) {
    //     arr.push({
    //       isOwn: i == 0 ? true : false,
    //       name: `工具人${i+1}号`,
    //       date: "2020-10-10 14:00:00",
    //       portrait: "https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20200624/C0595717620200624/origin/thumb/63a4f11442b3497db61aebe355326338_middle.jpg",
    //       isEmpty: false,
    //       showPrize: i == 1 || i == 0 ? true : false
    //     })
    //   } else {
    //     arr.push({
    //       isOwn: false,
    //       name: ``,
    //       date: "",
    //       portrait: "",
    //       isEmpty: true,
    //       showPrize: i == 1 || i == 0 ? true : false
    //     })
    //   }
    // }
    // this.setData({
    //   participantList: arr
    // })
    // var src = this.base64_decode(options.meta) // 'https://hcmtq.oss-accelerate.aliyuncs.com/AR/men/23/23.mp4 ' // this.base64_decode(options.meta)

    // wx.getSystemInfo({
    //   success: (res) => {
    //     this.setData({
    //       height: res.statusBarHeight
    //     })
    //   }
    // })
    // src = src.slice(0, -1) // 去除返回地址末尾的空格
    // if (src.startsWith("http:")) {
    //   // http 改为 https
    //   src = src.replace("http:", "https:")
    // }
    // this.setData({
    //   url: src,
    //   back: getCurrentPages().length > 1 ? true : false
    // }, () => {
    //   setTimeout(() => {
    //     var context = wx.createVideoContext('myVideo', this)
    //     context.play()
    //   }, 500);
    // })
    // 埋点
    app.globalData.mta.Event.stat("c_mtq_Albm_Ar_Playback", {})
    
    //获取unionid信息
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
    this.getDetail()
    wx.hideShareMenu();
  },
  // 详情接口
  getDetail () {
    // app.globalData.mta.Event.stat('c_mtq_aractivity',{'videolike': unionId})
    // 详情接口
    let params = {}
    this.data.arType=='share'?(params={
      unionId: app.globalData.unionid,
      arId: this.data.arId
    }):(params = {
      unionId: app.globalData.unionid,
      videoId: this.data.videoId,
      videoUrl: this.data.videoUrl
    })
    wx.request({
      url: this.data.arType=='share'?apiSettings.getArLikesByArId:apiSettings.ARLIKESVIDEO,
      method: 'POST',
      data: params,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        console.log(res, 'res')
        this.data.dataDetail = []
        // this.data.url = []
        this.setData({
          isLoading: false
        })
        if (res.data.code == 200) {
          this.setData({
            dataDetail: res.data.result,
            videoId: res.data.result.videoId,
            videoUrl: res.data.result.videoUrl,
          })
          this.data.dataDetail.state==2?this.setData({
            isState: true,
          }):this.setData({
            isState: false
          })
          if (this.data.dataDetail.state==2&&this.data.dataDetail.isSelf==true) {
            this.setData({
              sponsorAward: true,
            })
          }
          //点赞列表信息
          if (this.data.dataDetail.state!=0) {
            let arr = []
            for (let i = 0; i < 6; i++) {
                  // res.data.result.thumbVOList.forEach(element => {
                    if (i==0) {
                      arr.push({
                        isOwn: i == 0 ? true : false,
                        name: res.data.result.nickName,
                        date: res.data.result.createTime,
                        portrait: res.data.result.avatarUrl,
                        isEmpty: false,
                        showPrize: i == 1 || i == 0 ? true : false
                      })
                    } else {
                      arr.push({
                        isOwn: false,
                        name: (res.data.result.thumbVOList[i-1]&&res.data.result.thumbVOList[i-1].nickName)?res.data.result.thumbVOList[i-1].nickName:'',
                        date: (res.data.result.thumbVOList[i-1]&&res.data.result.thumbVOList[i-1].createTime)?res.data.result.thumbVOList[i-1].createTime:'',
                        portrait: (res.data.result.thumbVOList[i-1]&&res.data.result.thumbVOList[i-1].avatarUrl)?res.data.result.thumbVOList[i-1].avatarUrl:'',
                        isEmpty: (res.data.result.thumbVOList[i-1])?false:true,
                        showPrize: i == 1 || i == 0 ? true : false
                      })
                    }
                  // });
            }
            this.setData({
              isBindTheUser: true,
              participantList: arr,
              isOwn: res.data.result.isSelf
            })
          } else {
            this.setData({
              isBindTheUser: false,
            })
          }
          //获取video
          // var videoContext = wx.createVideoContext('myVideo')
          // console.log(videoContext)
          // videoContext.pause()//暂停播放
        } else{
          wx.showToast({
            title: '下载成功',
            icon: 'none',
            duration: 1500,
            mask: false
          });
        }
      }
    })
  },
  // 奖品详情---查看奖品
  readPrize(){
    // console.log('查看奖品')
    wx.navigateTo({
      url: '/mine/coupon/coupon',
    })
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
      this.getDetail()
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
  // 跳转生成二维码
  getGenerate () {
    wx.navigateTo({
      url: `/activity/arAct/poster/poster?id=${this.data.dataDetail.id}&path=activity/arAct/showAr/showAr&arType=share`,
    })
    this.setData({
      isShare: false
    })
  },
  downloadVideo() {
    let _this = this
    this.setData({
      isLoading: true
    })
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          console.log("未授权 >>")
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)
              res.authSetting = {
                "scope.userInfo": true,
                "scope.userLocation": true,
                "scope.writePhotosAlbum": true
              }
              _this.useWxDownloadFile()
            },
            fail(err) {
              console.log("openSetting >", err)
            }
          })
        } else {
          _this.useWxDownloadFile()
        }

      }
    })
  },
  // 清除弹窗
  getClose (e) {
    e.target.dataset.type==2?this.setData({
      isThumb: false
    }):this.setData({
      sponsorAward: false
    })
  },
  // 下载
  useWxDownloadFile() {
    let _this = this
    wx.downloadFile({
      url: _this.data.videoUrl, // 'https://hcmtq.oss-accelerate.aliyuncs.com/AR/men/23/23.mp4', //仅为示例，并非真实的资源
      success(res) {
        console.log("down file s>>", res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              _this.setData({
                isLoading: false
              })
              if (res.errMsg == "saveVideoToPhotosAlbum:ok") {
                wx.showToast({
                  title: '下载成功',
                  icon: 'none',
                  duration: 1500,
                  mask: false
                });
              }
              console.log("save video s>>", res, _this.data.isLoading)
            },
            fail(err) {
              _this.setData({
                isLoading: false
              })
              if (err.errMsg == "saveVideoToPhotosAlbum:fail cancel") {
                wx.showToast({
                  title: '您取消下载了',
                  icon: 'none',
                  duration: 1500,
                  mask: false
                });
              }
              console.log("save video e>>", err, _this.data.isLoading)
            }
          })
        } else {
          wx.showToast({
            title: '下载失败',
            icon: 'none',
            duration: 1500
          });
          _this.setData({
            isLoading: false
          })
        }
      },
      fail(err) {
        console.log("down file e>>", err)
        wx.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 1500
        });
        _this.setData({
          isLoading: false
        })
      }
    })
  },
  goBack() {
    wx.navigateTo({
      url: '/pages/album/checkin/checkin',
    })
  },
  goWeb() {
    wx.navigateTo({
      url: '/pages/webview/webview?path=https://m.xm520.com/activity/520/index.html?channel=520HD_XC_A'
    })
  },
  // 邀请或点赞视频
  getButtonPrize () {
    if (this.data.isOwn) {
      // 邀请
      console.log('邀请')
      // 未登录判断
      if (!this.data.isLogin) {
        return this.setData({
          authorityTips: true
        })
      }
      if(this.data.dataDetail.state==2||this.data.dataDetail.state==1||this.data.activitySchedule==1) {
        this.setData({
          isShare: true
        })
        return
      }
      if (this.data.dataDetail.state==0) {
        wx.request({
          url: apiSettings.saveArLikes,
          method: 'POST',
          data: {
            unionId: app.globalData.unionid,
            videoId: this.data.videoId,
            videoUrl: this.data.videoUrl,
          },
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code==200) {
              console.log(res, 'res<<',app.globalData)
              let str = encodeURIComponent(res.data.result.videoId)
              app.globalData.mta.Event.stat('c_mtq_aractivity',{'successactivity':app.globalData.unionid})
              app.globalData.mta.Event.stat('c_mtq_aractivity',{'successactivitydate':res.data.result.createTime})
              app.globalData.mta.Event.stat('c_mtq_aractivity',{'successactivityphone': app.globalData.userInfo.mobileNo})
              app.globalData.mta.Event.stat('c_mtq_aractivity',{'successactivityurl':`/activity/arAct/showAr/showAr?meta=${str}`})
              this.getDetail()
              this.setData({
                isShare: true
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 1500,
                mask: false
              });
            }
          }
        })
      }
    } else {
      let _this = this
      // 点赞
      console.log('点赞')
      if (!_this.data.isLogin) {
        return _this.setData({
          authorityTips: true
        })
      }
      if(_this.data.activitySchedule==1) {
        wx.showToast({
          title: '活动已结束',
          icon: 'none',
          duration: 1500,
          mask: false
        });
        return
      }
      if (_this.data.dataDetail.state==2) {
        wx.showToast({
          title: '活动点赞助力已完成',
          icon: 'none',
          duration: 1500,
          mask: false
        });
        return
      }
      _this.setData({
        isLoading: true
      })
      wx.request({
        url: apiSettings.addArLikesThumb,
        method: 'POST',
        data: {
          unionId: app.globalData.unionid,
          arId: _this.data.dataDetail.id,
        },
        header: {
          "Content-Type": "application/json"
        },
        success: res => {
          if (res.data.code==200) {
            app.globalData.mta.Event.stat('c_mtq_aractivity',{'likenum':_this.data.dataDetail.id})
            app.globalData.mta.Event.stat('c_mtq_aractivity',{'usernum':app.globalData.unionid})
            _this.getDetail()
            _this.setData({
              isLoading: false,
            })
            if (res.data.result.thumbType==1) {
              _this.setData({
                isThumb: true,
              })
            }
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 1500,
              mask: false
            });
          } else {
            _this.setData({
              isLoading: false,
            })
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1500,
              mask: false
            });
          }
        }
      })
    }
  },
  // 取消弹窗
  getCancel () {
    this.setData({
      isShare: false
    })
  },
  base64_decode: function (input) { // 解码，配合decodeURIComponent使用
    console.log(input, 'input')
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = base64EncodeChars.indexOf(input.charAt(i++));
      enc2 = base64EncodeChars.indexOf(input.charAt(i++));
      enc3 = base64EncodeChars.indexOf(input.charAt(i++));
      enc4 = base64EncodeChars.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    console.log("解码 >>", output);
    return decodeURIComponent(output)
    // return decodeURIComponent(this.utf8_decode(output))
    // return this.utf8_decode(output);
  },

  utf8_decode: function (utftext) { // utf-8解码
    var string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c1 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
        i += 2;
      } else {
        c1 = utftext.charCodeAt(i + 1);
        c2 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
        i += 3;
      }
    }
    return string;
  },

  videoErrorHandler(e) {
    console.log(e);
  },
  toHome() {
    wx.switchTab({
      url: '/pages/album/checkin/checkin'
    });
  },
  // 分享
  onShareAppMessage () {
    this.setData({
      isShare: false
    })
    app.globalData.mta.Event.stat('c_mtq_aractivity',{'sharecount':'true'})
    // console.log(this.data.videoId, this.data.videoId)
    let str = encodeURIComponent(this.data.videoId)
    return {
      title : '鲜檬AR扫描赢好礼' ,
      desc : 'AR活动' ,
      imageUrl:"../images/bj_share.jpg",
      path : `/activity/arAct/showAr/showAr?meta=${str}&arId=${this.data.dataDetail.id}&targetId=${this.data.videoId}`,
    };
  }
})
