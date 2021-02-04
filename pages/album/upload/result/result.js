import { Upload } from '../upload-model.js'

var uploadModel = new Upload()
var app =getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tmpPaths: [],
        allLegal: true,
        amount: 0,
        showVouchers: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var allLegal = app.globalData.uploadArr.reduce((accumulator, currentVal) => accumulator && currentVal.legal, true)
        // if(allLegal){
        //     uploadModel.modifyRedPacket().then(res => {
        //         this.setData({
        //             amount: res.data,
        //             showVouchers: true
        //         })
        //     })
        // }
        this.setData({
            tmpPaths: app.globalData.uploadArr,
            allLegal
        })
        app.globalData.uploadArr = []
    },

    toUpload(){
        wx.redirectTo({
            url: '/pages/album/upload/upload',
        })
    },

    closeVouchers(){
        this.setData({
            showVouchers: false
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})