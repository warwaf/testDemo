// pages/mine/member/equity/equity.js
const app = getApp();

Page({

   /**
    * 页面的初始数据
    */
   data: {
      equity: {
         gold: {
            msgList: [
               "3张摄影产品拍摄券；",
               "拍摄券可预约免费拍摄证件照、个人形象照；",
               "每年可使用1张拍摄券，预约1个摄影产品；",
               "每次拍摄提供1套服装，1个妆面造型；",
               "拍摄张数为10张，赠送拍摄底片；",
               "赠送照片云端终身存储账户，永不丢失。 "
            ],
            useRule: [
               "每次拍摄仅限使用一张拍摄券，同一会员或不同会员的拍摄券均不可合并使用；",
               "摄影产品拍摄券仅限在鲜檬旗下指定门店预约会员尊享摄影产品使用；",
               "使用摄影产品拍摄券需提前预约，并最终以鲜檬门店可拍摄时间为准；",
               "影产品拍摄券仅限购卡会员本人使用；",
               "单张摄影产品拍摄券有效期为1年，过期无效（为自然年，即以每年12月31日为期限）；",
               "会员在拍摄过程中超出会员权益范围内的服务 会产生额外收费，收费标准以门店公示为准。"
            ],
            charge: [
               "加服装：1套100元（含改妆），店内现结；",
               "加妆面：1次100元，店内现结；",
               "超人数：1人200元（含服装及底妆），店内现结；",
               "外景拍摄需求，以各门店拍摄定价为准。"
            ]
         },
         silver: {
            msgList: [
               "立减3000元仅限到店选定正价婚纱拍摄套餐后使用；",
               "滴滴专车接驾仅限从会员本人出发地到所预约门店所在地的单程服务；",
               "进店礼在会员本人到店后联系鲜檬门店工作人员获取；",
               "照片终身云存储账户为鲜檬云相册，每位会员对应本人一个账户；",
               "会员本人进店成交婚纱拍摄订单后，获得对应的订单礼。"
            ],
            useRule: [
               "以门店公示为准。"
            ],
            // charge: [
            //    "加服装：1套100元（含改妆），店内现结。",
            //    "加妆面：1次100元，店内现结。",
            //    "超人数：1人200元（含服装及底妆），店内现结。",
            //    "外景拍摄需求，以各门店拍摄定价为准。"
            // ]
         }
      },
      tabCode: "gold"
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log("eq >> options:", options)
      if (options.tabcode) {
         this.setData({
            tabCode: options.tabcode
         })
      }
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {

   },
   /**
    * 获取组件数据方法
    * @param {入参} e 
    */
   getTabCode(e) {
      let userInfo = app.globalData.userInfo
      if (e.detail == 'gold' && userInfo.isMember != 1) {
         return wx.redirectTo({
            url: '/mine/member/presentation/presentation?tabcode=gold'
         });
      }
      if (e.detail == 'silver' && userInfo.silverMember != 1) {
         return wx.redirectTo({
            url: '/mine/member/presentation/presentation?tabcode=silver'
         });
      }
      console.log("获取组件tab code e >>", e.detail)
      this.setData({
         tabCode: e.detail
      })
   },
})