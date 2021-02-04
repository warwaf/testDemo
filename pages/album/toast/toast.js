import { Setting } from '../setting/setting-model'
var settingModel = new Setting()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
        startTime: '',
        posterUrl: '',
        address: '',
        organize: ''
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

    async chooseImage(){
        const chooseResult = await app.chooseImage(1)
        wx.showLoading()
        try {
            var data = await app.uploadImage(chooseResult.tempFilePaths[0])
            wx.hideLoading()
        } catch (error) {
            wx.hideLoading()
        }
        try {
            await app.checkNetImage(data.OssPath)
            this.setData({
                posterUrl: data.OssPath,
                url: chooseResult.tempFilePaths[0]
            })
        } catch (error) {
            wx.showToast({
                title: '图片包含敏感内容，请重新上传',
                icon: 'none'
            })
        }
    },

    async savePoster(){
        if(!(this.data.startTime && this.data.address && this.data.organize)){
            return wx.showToast({
                title: '请完善活动信息',
                icon: 'none'
            })
        }
        if(!this.data.posterUrl){
            return wx.showToast({
                title: '请上传海报',
                icon: 'none'
            }) 
        }
        var data = {
            // activityId: 'hc-f-205249',
            activityId: app.globalData.roomInfo.room_no,
            posterUrl: this.data.posterUrl,
            startTime: this.data.startTime,
            endTime: this.data.startTime,
            activityAddress: this.data.address,
            activitySponsor: this.data.organize
        }
        const saveResult = await settingModel.savePosterInfo(data)
        wx.navigateBack({
            delta: 1
        })
    },

    bindDateChange(e){
        this.setData({
            startTime: e.detail.value
        })
    },

    addressInputHandler(e){
        this.setData({
            address: e.detail.value
        })
    },

    organizeInputHandler(e){
        this.setData({
            organize: e.detail.value
        })
    }
})