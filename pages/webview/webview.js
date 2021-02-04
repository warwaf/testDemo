// pages/webview/webview.js
import { Checkin } from '../album/checkin/checkin-model'
import { parseQueryString } from '../../utils/util'
var checkinModel = new Checkin()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      path:'',
      title: '蒙太奇',
      timper: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options,'option')
    console.log(app.globalData)
    this.setData({
      timper: new Date().getTime()
    })
    this.data.timper = new Date().getTime();
    // wx.hideShareMenu()
    if(options.scene){
      options = parseQueryString(decodeURIComponent(decodeURIComponent(options.scene)))
    }
    if (JSON.stringify(options) != "{}") {
      switch (options.path) {
        case 'https://mtqact.hucai.com/activity/201912CYWH':
          app.globalData.fromLive = 1
          this.data.title = '粤港澳摄影产业文化节'
          break;
        case 'https://mtqact.hucai.com/activity/202001XHG':
          this.data.title = '小黄狗'
          break
        case '202003XHG':
          options.path = 'https://mtqact.hucai.com/activity/202003XHG'
          this.data.title = '小黄狗'
          break
        case 'MXQH':
          if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
            options.path = `https://mtqcshi.hucai.com/test/activity/202003MXQH/dream.html#/`
          }else{
            options.path = `https://mtqcshi.hucai.com/test/activity/dream/dream.html#/`
          }
          options.activityCode = 'MXQH_202003'
          this.data.title = '梦想起航儿童画画大赛'
          break
        case 'DGLG_2020':
          if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
            options.path = `https://mtqcshi.hucai.com/ac/activity/202010LGSY/index.html`
          }else{
            options.path = `https://mtqcshi.hucai.com/test/activity/202010LGSY/index.html`
          }
          options.activityCode = 'DGLG_2020'
          this.data.title = '莞工摄影大赛'
          break
        default:
          this.data.title = '蒙太奇'
          break;
      }
      var queryStr = ''
      for (const key in options) {
        if (options.hasOwnProperty(key) && key!= 'path') {
          queryStr += `&${key}=${options[key]}`
        }
      }
      console.log(queryStr,'queryStr');
      await checkinModel.getUnionid()
      var path = options.path + '?unionid=' + getApp().globalData.unionid + queryStr
      var str = decodeURIComponent(path)
      app.saveUserChannel(`H5活动：${options.path}`, options.channel)
      console.log(str);
      this.setData({
        path: str
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(`/pages/webview/webview?path=MXQH&discoverId=${app.globalData.globalStoreId}`);
      const { discoverInfo } = app.globalData;
      let path = ''
      if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
              path = `/pages/webview/webview?path=https://mtqcshi.hucai.com/ac/activity/202010LGSY/index.html&id=${discoverInfo.id}`
      }else{
              path = `/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/202010LGSY/index.html&id=${discoverInfo.id}`
      }
    return {
      title: '莞工摄影大赛',
      path: path,
      imageUrl: 'https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20201113/dglg-banner.png'
    }
  }
})