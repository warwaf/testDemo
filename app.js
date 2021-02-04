import store from "./store/index"
import apiSettings from './utils/ApiSetting.js'
import mta from './utils/mta_analysis'
let mapAK = 'FcciCnNg0p2y8kdKnY51giC0mtHp3PQy'
const mtaConfig = {}
if (__wxConfig.accountInfo.appId == 'wx059f9118f045da79') {
  mapAK = 'FcciCnNg0p2y8kdKnY51giC0mtHp3PQy'
  mtaConfig.appID = '500688713'
  mtaConfig.event = '500688714'
  mtaConfig.secretKey = '259c7b4967482e37f5f5c90587f2e9da'
} else {
  mapAK = '07pExxn0FaEnizRV2rSWz4H8Sle3KEoE'
  // Host = 'http://192.172.9.62:8181'
  mtaConfig.appID = '500683430'
  mtaConfig.event = '500689124'
  mtaConfig.secretKey = '86cbbc9c25317f9f500d28a2aeb60571'
}

//拓展Page对象
const oldPage = Page
Page = function (app) {
  const {
    onLoad
  } = app
  app.onLoad = function (onLoadOptions) {
    var options = {}
    if (onLoadOptions.scene) {
      var parseQueryString = function (str) {
        var arr = [],
          length = 0,
          res = {};
        arr = str.split('&');
        length = arr.length;
        for (var i = 0; i < length; i++) {
          res[arr[i].split('=')[0]] = arr[i].split('=')[1];
        }
        return res;
      }
      options = parseQueryString(decodeURIComponent(decodeURIComponent(onLoadOptions.scene)))
    }
    if (onLoadOptions.actChannel || options.actChannel) {
      getApp().globalData.actChannel = onLoadOptions.actChannel || onLoadOptions.c || options.actChannel
    }
    if (onLoadOptions.actId || options.actId) {
      getApp().globalData.actId = onLoadOptions.actId || options.actId
    }
    if (options.discoverId || options.dId || onLoadOptions.discoverId || onLoadOptions.dId) {
      // wx.setStorageSync('globalStoreId', onLoadOptions.storeId)
      getApp().globalData.globalStoreId = options.discoverId || options.dId || onLoadOptions.discoverId || onLoadOptions.dId
    }

    if (options.id || onLoadOptions.id) {
      getApp().globalData.globalId = options.id || onLoadOptions.id
    }

    console.log('globalStoreId', getApp().globalData.globalStoreId);

    // else{
    //     if(wx.getStorageSync('globalStoreId') && !getApp().globalData.globalStoreId){
    //         getApp().globalData.globalStoreId = wx.getStorageSync('globalStoreId')
    //     }
    // }
    const pages = getCurrentPages()
    this.prevPage = pages[pages.length - 2] // 将上一页的页面对象赋为this.__previousPage
    if (typeof onLoad === 'function') {
      onLoad.call(this, onLoadOptions.scene ? options : onLoadOptions)
    }
  }
  return oldPage(app)
}


App({
  $store: store,
  login: function (callback) {
    var login_callback = callback
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          // if (JSON.stringify(this.globalData.userInfo) !== "{}") {
          //     this.globalData.options.customer_name = res.userInfo.nickName
          // } else {
          //     wx.navigateTo({
          //         url: '/pages/common/userinfo/userinfo'
          //     })
          // }
        } else {
          wx.showToast({
            title: '获取用户登录态失败：' + res.errMsg,
            icon: 'none'
          })
        }
      }

    });
  },


  onLaunch: function (options) {
    // 判断设备是否为 iPhone X
    this.checkIsIPhoneX()
    // this.getRegion()
    var _this = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取顶部导航栏的高度
    wx.getSystemInfo({
      success: function (res) {
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        _this.globalData.navigationHeight = totalTopHeight
        _this.globalData.navigateBlock = res.statusBarHeight

        //导航高度
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
        _this.globalData.navHeight = navHeight;
        _this.globalData.navTop = navTop;
        _this.globalData.windowHeight = res.windowHeight;
      }
    })
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    //这是示例代码，应用的接入代码请到“应用管理”进行拷贝
    mta.App.init({
      "appID": mtaConfig.appID,
      "eventID": mtaConfig.event, // 高级功能-自定义事件统计ID，配置开通后在初始化处填写
      "lauchOpts": options, //渠道分析,需在onLaunch方法传入options,如onLaunch:function(options){...}
      "statPullDownFresh": true, // 使用分析-下拉刷新次数/人数，必须先开通自定义事件，并配置了合法的eventID
      "statShareApp": true, // 使用分析-分享次数/人数，必须先开通自定义事件，并配置了合法的eventID
      "statReachBottom": true, // 使用分析-页面触底次数/人数，必须先开通自定义事件，并配置了合法的eventID
      "autoReport": true, //开启自动上报
      "statParam": true, //每个页面均加入参数上报
      "ignoreParams": [] //statParam为true时，如果不想上报的参数可配置忽略
    });
  },
  globalData: {
    //元旦活动是否开始或结束
    newYearActOver:false,
    isIPX: false,
    mapAK,
    mta,
    //用户
    userInfo: {},
    unionid: '',
    //房间
    roomInfo: {
      room_no: ''
    },
    activityInfo: {},
    roomConfig: [],
    fromShare: false,
    //详情
    photoArr: [],
    defaultUserInfo: {},
    //水印
    waterMark: 'vedio_test/24.png',
    selectPhotos: [],
    //上传
    uploadParam: {},
    uploadArr: [],
    uploadCompleted: true,
    uploadTimer: null,
    currentUploadRoom: '',
    searchInfo: {},
    options: {
      access_key: '',
      store_id: '',
      branch_id: '',
      customer_name: '',
      customer_phone: '',
      scene_name: '',
      product_sku: '',
      if_correct: '0',
      channel_id: '',
      job_id: '',
      Total_num: '0',
      isSort: '1',
      isjob_id: '1',
      order_sn: '',
      finishlink: '0', // 0是弹出结束任务单提示，否则是弹出提示并且跳转
      finishMsgid: '2', // 1是msgid类型
      CancelCTask: '1', //0表现显示取消任务上传任务按钮隐藏，1表示显示
      DeleteCPhotos: '1', //0表现显示删除照片按钮隐藏，1表示显示
    },
    // 本次打开下程序 是否弹出签到
    isSignin: false,
    wxToken: '',
    globalStoreId: 0,
    /**默认渠道0 */
    globalId: '', // 门店号
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], // 获取顶部栏高度
    actChannel: "", // 活动渠道
    verifyCode: "" // 短信验证码
  },
  // 获取省市区
  getRegion() {
    wx.request({
      url: "https://ns.hucais.com.cn/static/widgets/jcity/region.js",
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let _res = res.data
        let region = JSON.parse(_res.split("= ")[1].replace(";", ""))
        let newArr = [];
        newArr = region.filter(item => {
          return item.parent === "";
        });
        newArr.forEach(item => {
          item.city = [];
          region.forEach(child => {
            if (item.code === child.parent) {
              item.city.push(child);
            }
          });
        });
        newArr.forEach(parent => {
          parent.city.forEach(child => {
            child.district = [];
            region.forEach(gChild => {
              if (child.code === gChild.parent) {
                child.district.push(gChild);
              }
            });
          });
        });
        this.globalData.region = newArr
        // console.log("region >>", newArr)
      }
    });
  },
  checkIsIPhoneX: function () {
    const self = this
    wx.getSystemInfo({
      success: function (res) {
        // 根据 model 进行判断
        if (res.model.search('iPhone X') != -1) {
          self.globalData.isIPX = true
        }
      }
    })
  },

  /**
   * 自定义请求方法
   * @param { 上传参数 } param
   *   @url,
   *   header,
   *   data,
   *   method,
   *   dataType
   */
  request(param) {
    const baseUrl = apiSettings.Host,
      app = this
    return new Promise((resolve, reject) => {
      if (param.url.startsWith('https') || param.url.startsWith('http')) {
        var url = param.url
      } else {
        var url = baseUrl + param.url
      }
      let header = param.header ? param.header : {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      header = Object.assign(header, {
        accessToken: app.globalData.mtq_token
      })
      wx.request({
        url,
        data: param.data,
        dataType: "json",
        header,
        method: param.method ? param.method : 'GET',
        success: function (res) {
          resolve(res.data)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },

  /**
   * 上传图片并保存到房间
   * @param { 待上传图片数组 } this.globalData.uploadArr
   * @param { 上传目的房间 } activityId
   * }
   */
  uploadImageToRoom(activityId, groupName) {
    this.globalData.currentUploadRoom = activityId
    this.globalData.uploadCompleted = false
    var curIndex = false
    this.globalData.uploadArr.find((ele, index) => {
      curIndex = index
      return !ele.doneUpload
    })
    if (curIndex === false) return
    // 上传接口地址修改
    wx.uploadFile({
      // url: 'https://diy.hucai.com/api/fileapi/UploadCFile_diy', //this.globalData.uploadParam.uploadurl,
      url: 'https://image.hucai.com/api/fileapi/UploadCFile_diy', //this.globalData.uploadParam.uploadurl,
      filePath: this.globalData.uploadArr[curIndex].tempPath,
      name: 'filecontent',
      formData: {
        access_token: this.globalData.uploadParam.access_token,
        job_id: this.globalData.uploadParam.job_id
      },
      complete: res => {
        if (res.statusCode == 200) {
          var imageInfo = JSON.parse(res.data)
          if (imageInfo.code == 0) {
            this.globalData.uploadArr[curIndex].thumbUrl = imageInfo.data.oss_thumb_url
            this._saveImage(curIndex, imageInfo.data, groupName)
          } else {
            this.globalData.uploadArr[curIndex].thumbUrl = this.globalData.uploadArr[curIndex].tempThumbPath
            this.globalData.uploadArr[curIndex].done = true
          }
        } else {
          this.globalData.uploadArr[curIndex].done = true
        }
        this.globalData.uploadArr[curIndex].doneUpload = true
        if (curIndex == this.globalData.uploadArr.length - 1) {
          this.globalData.uploadCompleted = true
        } else {
          this.uploadImageToRoom(activityId, groupName)
        }
      }
    })
  },

  _saveImage(curIndex, imageInfo, groupName) {
    this.request({
      url: apiSettings.SaveImageDetail,
      dataType: "json",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        unionId: this.globalData.unionid,
        picId: imageInfo.FileName,
        fileName: imageInfo.FileName,
        activityId: this.globalData.currentUploadRoom,
        picUrl: imageInfo.OssPath,
        thumbnailUrl: imageInfo.oss_thumb_url,
        classification: groupName
      }
    }).then(res => {
      //图片保存失败 code：500 敏感信息
      if (res.code == 200) {
        this.globalData.uploadArr[curIndex].legal = true
      }
      this.globalData.uploadArr[curIndex].done = true
    })
  },

  /**
   * 上传图片
   * @param { 图片临时路径 } filePath
   */
  async uploadImage(filePath) {
    await this.getAccessToken()
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        // url: 'https://diy.hucai.com/api/fileapi/UploadCFile_diy',
        url: 'https://image.hucai.com/api/fileapi/UploadCFile_diy',
        filePath,
        name: 'filecontent',
        formData: {
          access_token: this.globalData.uploadParam.access_token,
          job_id: this.globalData.uploadParam.job_id
        },
        complete: res => {
          if (res.statusCode == 200) {
            var imageInfo = JSON.parse(res.data)
            resolve(imageInfo.data)
          } else {
            reject()
          }
        }
      })
    })
  },

  /**
   * 通过阿里云接口获取网络图片信息
   * @param {
   *     url: 图片地址
   * }
   */
  getImageInfo(url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url.indexOf('http://tmp') == -1 ? url.replace(/http:/, 'https:') : url,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

  /**
   * 检测一个本地图片是否违规
   * @param { 图片临时路径 } tmpPath
   */
  async checkLocalImage(tmpPath) {
    await this.getAccessToken()
    try {
      const netImg = await this.uploadImage(tmpPath)
      return this.checkNetImage(netImg.oss_thumb_url)
    } catch (error) {
      return Promise.reject('error: 图片上传失败')
    }
    // return new Promise(async (resolve, reject) => {
    /**********腾讯图片审核接口****start***********/
    // wx.uploadFile({
    //     url: apiSettings.Host +'/wfa/wxApp/auditPic',
    //     filePath,
    //     name: 'file',
    //     complete(res){
    //         if(res.statusCode == 200){
    //             const resT = JSON.parse(res.data)
    //             resolve(resT.result)
    //             // resolve(JSON.parse(res.data.result))
    //         }else{
    //             reject('请求失败')
    //         }
    //     }
    // })
    /**********腾讯图片审核接口****end***********/
    // })
  },

  /**
   * 检测一组/一张网络图片是否违规
   * @param { 图片网络地址 } urls
   */
  checkNetImage(urls) {
    urls = Array.isArray(urls) ? urls : [urls]
    return new Promise((resolve, reject) => {
      this.request({
        url: apiSettings.Pics,
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          urls: urls.join(',')
        }
      }).then(res => {
        if (res.code == 200 && res.result.length == 0) {
          resolve()
        } else {
          reject(res.result)
        }
      })
    })
  },

  /**
   * 敏感词校验
   */
  verifyContent(content) {
    return new Promise((resolve, reject) => {
      this.request({
        url: apiSettings.ContentVerify,
        method: 'GET',
        data: {
          content
        }
      }).then(res => {
        resolve(res.code == 200)
      })
    })
  },

  /**
   * 获取服务器令牌
   */
  getAccessToken(room) {
    var app = this
    return new Promise((resolve, reject) => {
      if (room == undefined && JSON.stringify(this.globalData.uploadParam) !== '{}') {
        resolve(this.globalData.uploadParam)
        return
      }
      wx.request({
        // url: 'https://video.hucai.com/api/fileapi/GetCAccessToken',
        url: 'https://image.hucai.com/api/fileapi/GetCAccessToken',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          access_key: 'BCTyY2cdvcFZApwz',
          store_id: 'C1509',
          branch_id: 'C1509-1',
          customer_name: '檬太奇',
          customer_phone: app.globalData.userInfo.mobileNo ? app.globalData.userInfo.mobileNo : '13725372605',
          scene_name: '时尚街拍',
          product_sku: '1004576',
          if_correct: '1',
          channel_id: 'Beautify',
          job_id: room ? room : app.globalData.roomInfo.room_no,
        },
        success: res => {
          if (res.data.code == 0) {
            var uploadInfo = res.data.data
            var obj = {
              access_token: uploadInfo.AccessToken,
              job_id: uploadInfo.job_id,
              uploadurl: uploadInfo.UploadUrl.substring(0, uploadInfo.UploadUrl.length - 1)
            }
            app.globalData.uploadParam = obj
            resolve(obj)
          }
        },
        fail: () => {
          reject()
        }
      })
    })
  },

  /**
   * 选择图片
   */
  chooseImage(num, obj) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: num ? num : 9,
        sizeType: obj && obj.sizeType ? obj.sizeType : ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

  /**
   * 压缩图片 并导出图片地址
   */
  async compressImage(tempPath, id) {
    const compress = wx.createCanvasContext(id, this);
    try {
      var res = await this.getImageInfo(tempPath)
    } catch (error) {
      return wx.showToast({
        title: error.message,
        icon: 'none'
      })
    }
    const h = 300 / res.width * res.height
    compress.drawImage(res.path, 0, 0, 300, h);
    compress.draw();
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: id,
        x: 0,
        y: 0,
        width: 300,
        height: h,
        fileType: 'jpg',
        success(res) {
          resolve(res.tempFilePath)
        },
        fail(e) {
          reject(e)
        }
      }, this)
    })
  },
  /**
   * 获取canvas 的路径
   * @param {*} id  cavans_id
   * @param {*} config 修改配置信息
   */
  canvasToTempFilePath(id, config) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath(Object.assign({
        canvasId: id,
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        fileType: 'jpg',
        success(res) {
          resolve(res.tempFilePath)
        },
        fail(e) {
          reject(e)
        }
      }, config), this)
    })
  },
  /**
   * 保存图片
   * @param {*} url
   */
  saveImageToPhotosAlbum(url) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success: res => {
          wx.showToast({
            title: '保存成功'
          })
          resolve(true)
        },
        fail(err) {
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击图片即可保存',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      })
                    }
                  }
                })
              }
            })
          } else if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
            wx.showToast({
              title: '取消保存'
            })
            resolve(false)
          } else {
            reject(err.errMsg)
          }
        }
      })
    })
  },
  /**
   * 保存用户渠道
   */
  saveUserChannel(page = '', channel = '') {
    return new Promise((resolve, reject) => {
      this.request({
        url: apiSettings.saveUserChannel,
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        data: {
          unionId: this.globalData.unionid,
          page,
          channel
        }
      }).then(res => {
        resolve(res)
      })
    })
  }
})
