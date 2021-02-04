// components/common/protocol/protocol.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

      disagree(){
          this.triggerEvent('clickEvent', false)
      },

      agree(){
          wx.setStorageSync('agreeProtocol', 1)
          this.triggerEvent('clickEvent', true)
      }

  }
})
