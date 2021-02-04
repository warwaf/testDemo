import { Base } from '../../utils/base.js'
import { Art } from './arActmodel'
var baseModel = new Base()
var artModel = new Art()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTypeDialog:false,
    // 是否发起活动
    isSendActivity:0,
    // 是否助力成功
    isHelpSuccess:0,
    // 用户活动信息
    userActivityInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //判断用户是否登录
    const res = await baseModel.getUnionid()
    if(!res){ 
      wx.navigateTo({
          url: '/pages/common/userinfo/userinfo',
      })
      return
    }
    const { unionid } = app.globalData;
    this.getActivityUserInfo(unionid)

  },
  getActivityUserInfo(unionid,refresh){
    artModel.getLikeInfo(unionid).then(res=>{
      if(res.code===200){
        if(refresh){
          wx.stopPullDownRefresh();//下拉刷新收起来
        }
        let thumbVOList = []
        if(res.result.thumbVOList == null){
          for(let i =0;i<5;i++){
            let obj = {}
            thumbVOList.push(obj)
          }
        }else if(res.result.thumbVOList.length >= 0 && res.result.thumbVOList.length < 5){
          let emptyLength = 5 - res.result.thumbVOList.length
          for(let i =0;i<emptyLength;i++){
            let obj = {}
            thumbVOList.push(obj)
          }
        }
        if(res.result.thumbVOList == null){
          res.result.thumbVOList = thumbVOList
        }else{
          res.result.thumbVOList = res.result.thumbVOList.concat(thumbVOList).slice(0,5)
        }
        this.setData({
          userActivityInfo : res.result,
          isSendActivity : res.result.state
        })
        if(res.result.state == 2){
          this.setData({
            isHelpSuccess: 1,
          })
        }
      }
    })
  },
  onShow() {
  
  },
  onPullDownRefresh(){
    const { unionid } = app.globalData;
    this.getActivityUserInfo(unionid,1)
  },
  //点击发起活动
  promotiona(){
      wx.navigateTo({
        url: '/pages/common/ar/ar?newyear=1',
      })
  },
  //  助力成功---查看奖品
  checkPrize(){
    this.setData({
      showTypeDialog : true
    })
  },
  // 奖品详情---查看奖品
  readPrize(){
    // console.log('查看奖品')
    wx.navigateTo({
      url: '/mine/coupon/coupon',
    })
  },
  // 关闭奖品详情
  closePrizeDetail(){
    this.setData({
      showTypeDialog : false
    })
  },
  // 发起助力
  async awaitHelp(){
    // console.log('发起助力')
    let data = {
      arId : this.data.userActivityInfo.id,
      unionId : this.data.userActivityInfo.unionId
    }
    await artModel.getInfoByActivityId(data).then(res=>{
      if(res.code === 200){
        let str = encodeURIComponent(res.result.videoId)
        wx.navigateTo({
          url: `/activity/arAct/showAr/showAr?meta=${str}`,
        })
      }
    })
  },
  //联系客服
  handleContact(e){
    // console.log(e)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:'鲜檬AR扫描赢好礼',
      path: `/activity/arAct/arAct`
    }
  },
})