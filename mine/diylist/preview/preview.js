var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let url = ''
        if (options.isSingle == 'true') {
            url = `https://diy.hucai.com/MobileDIY/GoMtqPreview?phone=${getApp().globalData.userInfo.mobileNo}&job_id=${options.job_id}&single=1&returnUrlView=/pages/mine/diylist/diylist&returnUrlOrder=/pages/album/diy/order/order`
        } else {
            url = `https://diy.hucai.com/MobileDIY/GoMtqPreview?phone=${getApp().globalData.userInfo.mobileNo}&job_id=${options.job_id}&returnUrlView=/pages/mine/diylist/diylist&returnUrlOrder=/pages/album/diy/order/order`
        }
        this.setData({ url })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
})