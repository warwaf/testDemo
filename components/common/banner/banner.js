// components/common/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indicatorDots: {
      type: String
    },
    interval: {
      type: Number
    },
    duration: {
      type: Number
    },
    imgUrls: {
      type: Array
    }
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
      jump(e){
          this.triggerEvent('clickEvent', e.currentTarget.dataset.info)
      }
  }
})
