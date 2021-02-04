var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */

     
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    toHome(){
        app.globalData.fromLive = 1
        wx.switchTab({
            url: '/pages/album/checkin/checkin'
        });
    },

    back(){
        wx.navigateBack({
            delta: 1
        });
    }
})