// pages/mine/wallet/result/result.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        account: 'chenhuiting',
        amount: '20.00'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    goBack(){
        wx.redirectTo({
            url: '/pages/mine/home/mine'
        })
    }
})