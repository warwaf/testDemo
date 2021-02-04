// components/common/turntable/turntable.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        number: {
            type: Number,
            default: 0,
            observer(newVal, oldVal, changePath){
                this.setData({
                    list: String(Math.floor(newVal)).split('')
                })
            }
        },

        scale: {
            type: Number,
            default: 1
        },

        symbol: {
            type: Boolean,
             default: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        list:[0]
    },

    /**
     * 组件的方法列表
     */
    methods: {
       
    },
})
