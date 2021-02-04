// components/loading/loading.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        text: {
            type: String,
            default: ''
        },
        type: {
            type: Number,
            default: 1
        },
        pos: {
            type: String,
            value: 'center'
        },
        showMask: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        timestamp: new Date().getTime()
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
