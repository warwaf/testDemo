//Component Object
var app = getApp();

Component({
  properties: {

  },
  data: {
    showAbout: false,
    showQA: false,
    showShare: false,
    QAList: [{
        q: {
          text: '抢购活动时间？总共多少名额？'
        },
        a: ['本次鲜檬0元抢购三亚婚纱旅拍活动名额共1000份，从2020年10月21日至2020年10月30日每天下午2点开始抢购，总共10天，每天100份，抢完即止；']
      },
      {
        q: {
          text: '如何参与抢购？'
        },
        a: ['参与者需先通过活动首页报名，从2020年10月21日至2020年10月30日每天下午2点，登录活动页面点击“立即抢购”按钮进行抢购；', '活动所有表格信息需填写用户真实信息，实际预约拍摄将以登记信息为准，填错或漏填名额均视无效。']
      },
      {
        q: {
          text: '每人有几次抢购机会，可以抢购几份名额？'
        },
        a: ['每个用户每天有一次抢购机会，每个用户只能抢购成功领取一份鲜檬0元三亚旅拍名额（同一微信ID、同一姓名及手机号视为同一用户）；', '如果夫妻双方均抢到名额，仅可享受一次。']
      },
      {
        q: {
          text: '抢购成功后如何预约？名额使用期限？'
        },
        a: ['抢购成功后，新人需在限定时间内在线完善资料，完成即可领取鲜檬0元三亚旅拍名额；', '完善资料后，鲜檬客服将尽快与新人联系沟通拍摄时间; 如果有任何疑问，请致电鲜檬三亚预约拍摄热线：0898-88839595；; 如果有任何疑问，请致电鲜檬完美嫁衣三亚预约拍摄热线：0898-88839595；', '2020年10月抢购三亚鲜檬婚纱旅拍成功用户，拍摄时间截止为2021年3月31日前，过期视为自动放弃，不可延期使用。2020年9月抢购鲜檬三亚旅拍成功用户，拍摄时间截止为2020年12月31日，过期视为自动放弃，不可延期使用；']
      },
      {
        q: {
          text: '曾经参与过鲜檬抢购活动，这次还能再参与吗？'
        },
        a: ['2020年期间，多次重复报名参与鲜檬0元抢购婚纱旅拍活动的用户（三亚、泰安、或其他城市），如屡次抢购成功，名额仅可使用一次，只能选择一个城市旅拍，不可叠加或重复使用。如果夫妻双方均抢到名额，视为同一对新人，同理名额仅可享受一次，只能选择一个城市旅拍；', '2020年9月抢购鲜檬三亚旅拍成功用户拍摄时间截止为2020年12月31日，过期视为自动放弃，不可延期使用；2020年10月抢购三亚鲜檬婚纱旅拍成功用户拍摄时间截止为2021年3月31日前，过期视为自动放弃，不可延期使用。']
      },
      {
        q: {
          text: '鲜檬0元三亚旅拍名额是否能退换，转让或售卖？'
        },
        a: ['新人抢到名额后需尽快确认拍摄时间，如档期告急不符合新人需求，名额不可退换；', '如因天气原因或其他不抗力造成拍摄延期或取消，名额不可退换；', '名额不可以任何理由及方式转让他人或售卖，或兑换成为现金或其他福利；', ' 如有转让及售卖现象发生，主办方有权取消其名额资格；', ' 实际预约拍摄将以活动登记信息为准，信息填错或漏填名额均视无效。']
      },
      {
        q: {
          text: '免费拍摄套餐是否包含往返机票、餐饮与其他项目？'
        },
        a: ['否，往返机票、餐饮，与其他消费项目需要新人自行解决，费用自理。']
      },
      {
        q: {
          text: '免费拍摄套餐是否可以用于全家福、写真或其他类型拍摄服务?'
        },
        a: ['否，本次免费拍摄仅限于婚纱摄影，不能作为全家福、写真或其他非婚纱摄影类型的拍摄服务。新人如有需求，可以与官方客服联系，自愿自费进行升级。']
      },
      {
        q: {
          text: '免费拍摄套餐是否包含精修片及影像定制产品?'
        },
        a: ['否，本次免费拍摄仅限于婚纱摄影，不包含精修片及后期产品。新人如有需求，可以与门店客服联系，自由选购影像定制产品。']
      },
      {
        q: {
          text: '鲜檬线下门店是否有相同抢购活动？'
        },
        a: ['本次活动1000份名额限线上抢购，如需到店服务，新人可自行联系鲜檬线下门店，沟通婚纱旅拍活动。']
      },
      {
        q: {
          text: '整体拍摄行程几天？'
        },
        a: ['整体时间分为3天，提前1天到店选服装（16：00到店），第2天全程拍摄，第3天选片。']
      },
      {
        q: {
          text: '拍摄服务是否一对一？'
        },
        a: ['资深摄影师、化妆师、摄影助理提供非一对一服务，在拍摄期间排队属于正常现象。']
      },
      {
        q: {
          text: '拍摄当天到店时间？'
        },
        a: ['每日19：00前门店调度客服会统一通知分批到店化妆时间，具体时间以通知为准。']
      },
      {
        q: {
          text: '如果拍摄遇到下雨，如何处理？'
        },
        a: ['下雨安排：如阵雨待雨停后，继续拍摄，如持续下雨可协商改为内景拍摄，由于档期爆满无法延期拍摄，敬请理解。']
      },
      {
        q: {
          text: '是否有隐形消费？'
        },
        a: ['鲜檬承诺本次活动套餐内所有服务均透明消费，不含任何隐形消费；']
      },
      {
        q: {
          text: '其他疑问？'
        },
        a: ['如有其他疑问，可联系鲜檬官方客服热线：', '活动客服热线：400-805-2189', '三亚预约拍摄热线：0898-88839595']
      }
    ],
    isLoading: false
  },
  methods: {
    handleContact(e) {
      console.log(e);
      app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
        'service': 'true'
      })
    },
    downloadPic(e) {
      this.setData({
        isLoading: true
      })
      wx.downloadFile({
        url: 'https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20200906/HB-bj.png',
        success: (res) => {
          console.log(">>>", res)
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: res => {
                console.log(">> >>>", res)
                wx.showToast({
                  title: '保存成功'
                })
                this.setData({
                  isLoading: false
                })
              },
              fail: err => {
                wx.showToast({
                  title: '保存失败',
                  icon: "none"
                })
                this.setData({
                  isLoading: false
                })
              }
            })
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    handlePop(e) {
      let {
        type
      } = e.currentTarget.dataset
      switch (type) {
        case 'about':
          this.setData({
            showAbout: !this.data.showAbout
          })
          app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
            'btnabout': 'true'
          })
          break;
        case 'QA':
          this.setData({
            showQA: !this.data.showQA
          })
          app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
            'btnqa': 'true'
          })
          break;
        case 'share':
          this.setData({
            showShare: !this.data.showShare
          })
          app.globalData.mta.Event.stat('c_mtq_activity_seckill', {
            'btnshare': 'true'
          })
          break;
        default:
          this.setData({
            showAbout: false,
            showQA: false,
            showShare: false
          })
          break;
      }
    },
  },
  created: function () {

  },
  attached: function () {

  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '三亚鲜檬0元旅拍',
      path: `/pages/activity/photographyActivity/index?actId=${app.globalData.actId ? app.globalData.actId : ""}`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20200906/share-img.png"
    }
  }
});