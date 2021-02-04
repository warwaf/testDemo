// components/navbar/index.js
var app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true
    },
    bgColor: {
      type: String,
      value: '#fff'
    },
    iconColor: {
      type: String,
      value: '#000'
    },
    backType: {
      type: String,
      value: "home"
    },
    custom: {
      type: Object,
      value: {
        path: "/pages/album/checkin/checkin",
        type: "switch"
      }
    },
    mtaInfo: {
      type: Object,
      value: {
        name: ""
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: app.globalData.navHeight,
        navTop: app.globalData.navTop
      })
      let url = decodeURIComponent(this.data.custom.path)
      console.log("url >>>", this.data.custom.path, url)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      if (this.data.mtaInfo&&this.data.mtaInfo.name) {
        console.log(">>>>", this.data.mtaInfo)
        app.globalData.mta.Event.stat(this.data.mtaInfo.name, {
          "btnback": this.data.backType
        })
      }
      switch (this.data.backType) {
        case "home":
          wx.switchTab({
            url: '/pages/album/checkin/checkin'
          })
          break;
        case "order":
          wx.redirectTo({
            url: '/mine/order/order'
          })
          break;
        case "back":
          wx.navigateBack({
            delta: 1
          })
          break;
        default:
          if (this.data.custom.type == "switch") {
            let url = decodeURIComponent(this.data.custom.path)
            wx.switchTab({
              url: url
            })
          } else {
            let url = decodeURIComponent(this.data.custom.path)
            console.log(">>>", url)
            wx.navigateTo({
              url: url
            });
          }
          break;
      }
    },
    // 返回上一页
    toBack: function () {
      wx.navigateBack({
        delta: 1
      });
    },
    //回主页
    toHome: function () {

    },
  }
})
