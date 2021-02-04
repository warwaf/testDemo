// activity/arAct/poster/poster.js
// const { wxml, style, urlStr } = require('./demo.js')
import apiSettings from '../../../utils/ApiSetting.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    width: '375',
    height: '520',
    isLoading: true
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setEnableDebug({enableDebug: true})
    console.log(options, 'options')
    // if (options) {
    // }
    wx.request({
      url: apiSettings.getQrcode,
      method: 'POST',
      data: {
        path: 'activity/arAct/showAr/showAr',
        scene: `arId=${options.id}&arType=${options.arType}`
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        this.setData({
          isLoading: false
        })
        if(res.data.code==200) {
          console.log(res.data.message, 'res.data')
          this.setData({
            src: res.data.message
          })
          const wxml =  `
          <view class="poster_content">
            <image class="poster_content_img" src="https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/mtq/20201222/C0767694720201222/origin/53e6caf1905e4be3a00b57c0570501f8.png"></image>
            <image class="qrCode" src="${res.data.message}"></image>
          </view>
          `
          // const wxml = `<text>${res.data.message}</text>`
          const style = {
            poster_content:{
              // display: 'flex',
              // flexDirection: 'row',
              // justifyContent: 'center',
              // alignItems: 'center',
              position: 'absolute',
              // left: 0,
              // textAlign: 'center'
              top:0
            },
            poster_content_img:{
              width: 349,
              height: 504,
              marginTop: 13,
              marginLeft: 13,
            },
            qrCode:{
              position: 'absolute',
              bottom: 24,
              left: 42,
              width: 80,
              height: 80,
            }
          }
          // urlStr.getUrl()
          // var windowWidth = wx.getSystemInfoSync().windowWidth;
          // var windowHeight = wx.getSystemInfoSync().windowHeight;
          wx.getSystemInfo({
            success: (result) => {
              console.log(result, 'result<<<')
            },
          })
          let num = wx.getSystemInfoSync().windowHeight>700?0.7:0.85
          this.setData({
            width: wx.getSystemInfoSync().windowWidth,
            height: wx.getSystemInfoSync().windowHeight*num
          })
          this.widget = this.selectComponent('.widget')
          const p1 = this.widget.renderToCanvas({ wxml, style })
          p1.then((res) => {
            console.log('container', res.layoutBox)
            this.container = res
          })
        }
        console.log(res, 'res<<<<')
        
      }
    })
    // var windowWidth = wx.getSystemInfoSync().windowWidth;
    // var windowHeight = wx.getSystemInfoSync().windowHeight;
    // this.setData({
    //   width: wx.getSystemInfoSync().windowWidth,
    //   height: wx.getSystemInfoSync().windowHeight*0.86
    // })
    // this.widget = this.selectComponent('.widget')
    wx.hideShareMenu();
  },
  getRenderToCanvas () {
    // const p1 = this.widget.renderToCanvas({ wxml, style })
    // p1.then((res) => {
    //   console.log('container', res.layoutBox)
    //   this.container = res
    // })
    // this.extraImage()
  },
  extraImage() {
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      this.setData({
        src: res.tempFilePath,
        // width: this.container.layoutBox.width,
        // height: this.container.layoutBox.height
      })
      //点击保存到相册
      var self = this;
      wx.saveImageToPhotosAlbum({
        filePath: self.data.src,
        success(res) {
          // wx.showModal({
          //   content: '图片已保存到相册，赶紧晒一下吧~',
          //   showCancel: false,
          //   confirmText: '好的',
          //   confirmColor: '#333',
          //   success: function (res) {
          //     if (res.confirm) {
          //       console.log('用户点击确定');
          //     }
          //   }, fail: function (res) {
          //     console.log(res)
          //   }
          // })
          wx.showToast({
            title: '图片已保存至相册',
            icon: 'none',
            duration: 1500,
            mask: false
          });
        }
      })
      console.log(res, 'res<<<')
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    setTimeout(() => {
      this.getRenderToCanvas()
    }, 500);
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

  }
})