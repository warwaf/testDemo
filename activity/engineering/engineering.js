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
    console.log(options,'options')
      /**
       * 发现id  位置信息  渠道信息
       */
      const { type, id, position, channel } = options; 
      app.globalData.activity_channel = channel;
      // app.globalData.returnUrl = '/activity/engineering/engineering?id='+id;
      let baseUrl= ""
      let url = '';
      if (__wxConfig.accountInfo.appId == 'wx059f9118f045da79') {
          baseUrl = 'https://mtqcshi.hucai.com/ac/activity/202010LGSY';
      } else {
          baseUrl = 'https://mtqcshi.hucai.com/test/activity/202010LGSY';
      }
      try{
        //获取用户unionid
        const res = await activity.getUnionid()
        // console.log(res,'用户unionid')
        // 无unionid
        if(res == false){
          url = `${baseUrl}/index.html?id=${id}`
        }else{
          url = `${baseUrl}/index.html?id=${id}&unionid=${app.globalData.unionid}`
        }
      }catch(error){
        url = `${baseUrl}/index.html?id=${id}`
      }

      // if (__wxConfig.envVersion == 'release') {
      //     baseUrl = 'https://m.xm520.com/activity/201910LGSY';
      // } else {
      //     baseUrl = 'https://mtqcshi.hucai.com/test/activity/LG';
      // }
      // try {
      //    const res = await activity.getUnionid();
      //    const city = await getLocaltion();  
      //    if(res == false){
      //       url = `${baseUrl}/index.html?city=${city}&id=${id}&channel=${channel}`
      //       if (options.type == 'prize') {
      //         url = `${baseUrl}/prizeList.html?id=${id}&channel=${channel}`
      //       }
      //    }else{
      //       url = `${baseUrl}/index.html?city=${city}&id=${id}&unionid=${app.globalData.unionid}&channel=${channel}`
      //       if(position == 1){
      //         url = `${baseUrl}/index.html?city=${city}&position=1&id=${id}&unionid=${app.globalData.unionid}&channel=${channel}`
      //       }
      //       if (options.type == 'prize') {
      //         url = `${baseUrl}/prizeList.html?id=${id}&unionid=${app.globalData.unionid}&channel=${channel}`
      //       }
      //    }
      // } catch (error) {
      //   url = `${baseUrl}/index.html?id=${id}`
      //   if (options.type == 'prize') {
      //     url = `${baseUrl}/prizeList.html?id=${id}`
      //   }
      // }

      // app.globalData.mta.Event.stat('c_mtq_Dynamics_Banner_channel',{ 
      //   'count':app.globalData.unionid,
      //   'channel': channel
      // })
      console.log(url,'url')
      this.setData({
        path:url,
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
         title:'第10届老马杯学生摄影十佳评选活动',
         path: `/activity/engineering/engineering?id=${this.data.id}`,
         imageUrl:"https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/333608a25de642959ec4ea9e43a667ce.png"
      }
  }
})