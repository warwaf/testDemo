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
          text: '如何预约？名额使用期限？'
        },
        a: ['参与者需先通过活动页面填写预约表格，活动表格信息需填写用户真实信息，实际预约拍摄将以登记信息为准，填错或漏填名额均视无效。', '填写表格后，鲜檬客服将尽快与新人联系沟通拍摄时间; 如果有任何疑问，请致电鲜檬三亚预约拍摄热线：0898-88839595；', '2020年12月31日前需完成拍摄，逾期名额视为自动放弃。']
      },
      {
        q: {
          text: '每人享受几份名额？'
        },
        a: ['仅限通过本活动页链接报名活动的用户领取名额，每个用户只能领取及享受一次名额（夫妻均领取名额，仅可享受一次），同一手机号/微信id/姓名视为同一用户。']
      },
      {
        q: {
          text: '鲜檬0元三亚旅拍名额是否能退换，转让或售卖？'
        },
        a: ['新人领取名额后需尽快确认拍摄时间，如档期告急不符合新人需求，名额不可退换；', '如因天气原因或其他不抗力造成拍摄延期或取消，名额不可退换', '名额不可以任何理由及方式转让他人或售卖，或兑换成为现金或其他福利；', '如有转让及售卖现象发生，主办方有权取消其名额资格；', '实际预约拍摄将以活动登记信息为准，信息填错或漏填名额均视无效。']
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
          text: '是否有隐形消费？'
        },
        a: ['鲜檬摄影承诺本次活动套餐内所有服务均透明消费，不含任何隐形消费。']
      },
      {
        q: {
          text: '其他疑问？'
        },
        a: ['如有其他疑问，可联系鲜檬官方客服热线:\n活动客服热线：400-805-2189\n 三亚预约拍摄热线：0898-88839595。']
      }
    ],
    packageList: [
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package1.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package2.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package3.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package4.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package5.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package6.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package7.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package8.png",
      "https://hcmtq.oss-accelerate.aliyuncs.com/resource2020/activity/bd/bd-package9.png"
    ]
  },
  methods: {
    downloadPic(e) {
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
              },
              fail: err => {
                wx.showToast({
                  title: '保存失败'
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
          break;
        case 'QA':
          this.setData({
            showQA: !this.data.showQA
          })
          break;
        case 'package':
          this.setData({
            showPackage: !this.data.showPackage
          })
          break;
        default:
          this.setData({
            showAbout: false,
            showQA: false,
            showPackage: false
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
      title: '鲜檬完美嫁衣0元三亚旅拍',
      path: `/pages/activity/photographyActivity/index`,
      imageUrl: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20200906/share-img.png"
    }
  }
});
