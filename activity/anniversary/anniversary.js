import activity from '../activity-model'
import { getLocaltion } from '../../utils/util'
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
      const { id, position, channel } = options; 
      app.globalData.activity_channel = channel;
      app.globalData.returnUrl = '/activity/anniversary/anniversary?id='+id;
      let baseUrl= ""
      let url = '';
      if (__wxConfig.envVersion == 'release') {
          baseUrl = 'https://m.xm520.com/activity/201909SYDS';
      } else {
          baseUrl = 'https://mtqcshi.hucai.com/test/activity/threeTest';
      }
      try {
         const res = await activity.getUnionid();
         const city = await getLocaltion();
         if(res == false){
            url = `${baseUrl}/index.html?city=${city}&id=${id}&channel=${channel}`
            if (options.type == 'prize') {
              url = `${baseUrl}/prizeList.html?id=${id}&channel=${channel}`
            }
         }else{
            url = `${baseUrl}/index.html?city=${city}&id=${id}&unionid=${app.globalData.unionid}&channel=${channel}`
            if(position == 1){
              url = `${baseUrl}/index.html?city=${city}&position=1&id=${id}&unionid=${app.globalData.unionid}&channel=${channel}`
            }
            if (options.type == 'prize') {
              url = `${baseUrl}/prizeList.html?id=${id}&unionid=${app.globalData.unionid}&channel=${channel}`
            }
            
         }
      } catch (error) {
        url = `${baseUrl}/index.html?id=${id}`
        if (options.type == 'prize') {
          url = `${baseUrl}/prizeList.html?id=${id}`
        }
      }
      console.log(url);
      app.globalData.mta.Event.stat('c_mtq_Dynamics_Banner_channel',{ 
        'count':app.globalData.unionid,
        'channel': channel
      })
      this.setData({
        path:url,
        id
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
  onShow: function () {

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
      return {
         title:'虎彩OK摄影大赛',
         path: `/activity/anniversary/anniversary?id=${this.data.id}`,
         imageUrl:"https://hcmtq.oss-accelerate.aliyuncs.com/SystemImg/30fx.jpg"
      }
  }
})