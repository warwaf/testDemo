// components/sticky/sticky-item/index.js
Component({
  externalClasses: ['i-class'],
  options: {
    multipleSlots: true
  },
  relations: {
    '../index': {
      type: 'parent'
    }
  },
  data: {
    top: 0,
    height: 0,
    isFixed: false,
    index: -1,
  },
  methods: {
    updateScrollTopChange(scrollTop) {
        const data = this.data;
        //数据项 距离顶部的高度
        const top = data.top;
        const height = data.height;
        this.setData({
            
            isFixed: (scrollTop + 2 > top &&  scrollTop < top+height-20) ? true : false
      })
    },
    updateDataChange(index) {
      const className = '.i-sticky-item';
      const query = wx.createSelectorQuery().in(this);
      query.select(className).boundingClientRect((res) => {
        if (res) {
          this.setData({
            top: res.top,
            height: res.height,
            index: index
          })
        }
      }).exec()
    }
  }
})