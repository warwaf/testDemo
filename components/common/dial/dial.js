// components/common/dial/dial.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        degree: {
            type: Number,
            default: 0,
            observer(newVal, oldVal, changePath) {
                if (newVal > 360){
                    newVal = Math.floor(newVal % 360)
                } else if(newVal < 0){
                    newVal = Math.floor(360 - (newVal % 360))
                }
                if (newVal > 180){
                    this.setData({
                        rightBlock: true
                    })
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        rightBlock: false
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
