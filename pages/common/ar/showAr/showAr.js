// pages/showAr/showAr.js
const app = getApp();
import uilt from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: (new Date(uilt.formatTime1(new Date()))).getTime(),
    height: 0,
    url: '',
    meta: null,
    back: false,
    isLoading: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // uilt.sharePyq()//分享朋友圈
    var src = this.base64_decode(options.meta) // 'https://hcmtq.oss-accelerate.aliyuncs.com/AR/men/23/23.mp4 ' // this.base64_decode(options.meta)
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.statusBarHeight
        })
      }
    })
    src = src.slice(0, -1) // 去除返回地址末尾的空格
    if (src.startsWith("http:")) {
      // http 改为 https
      src = src.replace("http:", "https:")
    }
    this.setData({
      url: src,
      back: getCurrentPages().length > 1 ? true : false
    }, () => {
      setTimeout(() => {
        var context = wx.createVideoContext('myVideo', this)
        context.play()
      }, 500);
    })
    app.globalData.mta.Event.stat("c_mtq_Albm_Ar_Playback", {})
  },
  downloadVideo() {
    console.log(">>>", 12313123)
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
  useWxDownloadFile() {
    let _this = this
    wx.downloadFile({
      url: _this.data.url, // 'https://hcmtq.oss-accelerate.aliyuncs.com/AR/men/23/23.mp4', //仅为示例，并非真实的资源
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
    wx.navigateBack({
      delta: 1
    })
  },
  goWeb() {
    wx.navigateTo({
      url: '/pages/webview/webview?path=https://m.xm520.com/activity/520/index.html?channel=520HD_XC_A'
    })
  },
  base64_decode: function (input) { // 解码，配合decodeURIComponent使用
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
  }
})
