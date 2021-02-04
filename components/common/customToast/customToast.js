// components/common/customToast/customToast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iconUrl: {
      type: String
    },
    msg: {
      type: String
    },
    duration: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // animation: "",
    isShow: false,
    durationT: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      let duration = this.data.duration ? this.data.duration : 1500
      this.setData({
        isShow: true,
        durationT: duration / 1000
      })
      setTimeout(() => {
        this.setData({
          isShow: false
        })
      }, duration)
    },
    hide() {
      this.setData({
        isShow: false
      })
    },
  }
})