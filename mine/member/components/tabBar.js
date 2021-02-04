// mine/member/components/tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabCode: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    actCode: "gold"
  },
  observers: {
    "tabCode": function (tabCode) {
      this.setData({
        actCode: tabCode
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clikTab(e) {
      let {
        code
      } = e.currentTarget.dataset
      this.setData({
        actCode: code
      })
      this.triggerEvent('getTabCode', code)
    },
  }
})