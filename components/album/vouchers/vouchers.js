// components/vouchers/vouchers.js
Component({
    /**
     * 组件的属性列表
     */
    timer: null,
    properties: {
        amount: {
            type: Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        animate: true,
        opened: false,
        subCoin: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        close: function(){
            this.triggerEvent('closeEvent', {})
        },

        backToUpload: function(){
            wx.redirectTo({
                url: '/pages/album/upload/upload',
            })
        },

        open: function(){
            this.setData({
                opened: true,
                subCoin: true
            })
        }
    },

    lifetimes: {
        attached() {
            setTimeout(()=>{
                this.setData({
                    animate: false
                })
            },1000)
        }
    }
})
