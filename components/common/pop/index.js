// components/common/pop/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: String,
        visibile: {
            type: Boolean,
            value: false
        },
        showTitle: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        tapCancel() {
            this.setData({
                visibile: false
            })
            this.triggerEvent('cancel');
        },
        tapComfirm() {
            this.triggerEvent('comfirm');
        }
    }
})