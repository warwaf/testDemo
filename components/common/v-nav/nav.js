Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: String,
    },
    /**
     * 组件的初始数据
     */
    data: {
        height:0,
        back:true
    },
    ready(){
        this.setData({
            height: wx.getSystemInfoSync()['statusBarHeight'],
            // back: getCurrentPages().length > 1 
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        goBack(){
            wx.navigateBack({delta:1})
        },
    }
})