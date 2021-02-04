import activity from '../activity-model'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
      /**
       * 发现id  位置信息  渠道信息
       */
      let baseUrl= ""
      let url = '';
      if (__wxConfig.envVersion == 'release') {
          baseUrl = 'https://mtqact.hucai.com/activity/201910QD';
      } else {
          baseUrl = 'https://mtqcshi.hucai.com/test/activity/201910QD';
      }
      const res = await activity.getUnionid();
      url = `${baseUrl}/index.html?unionid=${app.globalData.unionid}`
      this.setData({
        path:url
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
         title:'传照片，兑好礼',
         path: `/activity/checkin/checkin`,
         imageUrl:"https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/0bbba92be5f44580bcaa3a1a36038b39.jpg"
      }
  }
})