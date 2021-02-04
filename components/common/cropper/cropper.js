// components/cropper/cropper.js
import WeCropper from './we-cropper.js'
import { Setting } from '../../../pages/album/setting/setting-model'
var settingModel = new Setting()
const app = getApp()
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.screenHeight - app.globalData.navigationHeight - 50
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      },
      boundStyle: {
        color: "#04b00f",
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      }
    },
    /**是否还原 */
    isReduction: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad(options) {
      if (options.src && options.ratio) {
        this.data.src = options.src
        this.data.cropperOpt.cut.height = Math.floor(300 / Number(options.ratio))
        this.data.cropperOpt.cut.y = Math.floor(Math.floor(height - (300 / Number(options.ratio))) / 2)
      }
      this.init();
    },
    touchStart(e) {
      // this.cropper.touchStart(e)
      const isReduction = this.data.isReduction;
      this.cropper.touchStart({
        touches: e.touches.filter(i => i.x !== undefined)
      });
      if (!isReduction) {
        this.setData({
          isReduction: true
        })
      }
    },
    touchMove(e) {
      // this.cropper.touchMove(e)
      this.cropper.touchMove({
        touches: e.touches.filter(i => i.x !== undefined)
      })
    },
    touchEnd(e) {
      this.cropper.touchEnd(e)
    },
    preview() {
      this.cropper.getCropperImage()
        .then((src) => {
          wx.previewImage({
            urls: [src]
          })
        })
        .catch(() => {
          wx.showToast({
            title: '生成图片失败，请稍后重试'
          })
        })
    },
    complete(){
      wx.showLoading()
      this.cropper.getCropperImage()
        .then((src) => {
          app.uploadImage(src).then(result => {
            wx.hideLoading()
            var pages = getCurrentPages();
            var prePage = pages[pages.length - 2];
            prePage.cropCompleteEvent(result.OssPath)
            wx.navigateBack({
              delta: 1
            })
          })
        })
        .catch(() => {
          wx.showToast({
            title: '生成图片失败，请稍后重试'
          })
        })
    },
    /**初始化画布 */
    init() {
      const {
        cropperOpt
      } = this.data,
        src = this.data.src;

      cropperOpt.boundStyle.color = "#04b00f";

      this.setData({
        cropperOpt
      })
      this.cropper = new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          if (src) {
            ctx.pushOrign(src);
          }
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          wx.hideToast()
        })
    },
    /**还原画布 */
    reduction() {
      const isReduction = this.data.isReduction,
        self = this;
      if (!isReduction) return;
      this.cropper.reduction().then(() => {
        self.setData({
          isReduction: !isReduction
        })
      });
    },
    /**旋转画布 */
    rotate() {
      this.cropper.rotateAngle = this.cropper.rotateAngle + 1;
      this.cropper.rotate();
    },
    /**取消编辑 */
    cancel() {
      wx.navigateBack();
    }
  }
})
