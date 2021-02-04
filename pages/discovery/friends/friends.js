var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarColor({
            backgroundColor: '#ffffff'
          })
        this.setData({
            url: app.globalData.downShareDetailsImage
        })
    },
    downImage(){
       wx.navigateBack({
            delta:1
       })
    }
})