import activityModel from '../../setting/setting-model'

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        activityModel.getPersonalRecord().then(list => {
            this.setData({
                list
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    switchDetail(e){
        var index = e.currentTarget.dataset.index, activityInfo = this.data.list[index]
        if(activityInfo.showDetail){
            this.setData({
                ['list[' + index + '].showDetail']: false
            }) 
            return
        }
        if(activityInfo.detail){
            this.setData({
                ['list[' + index + '].showDetail']: true
            }) 
            return
        }
        wx.showLoading({
            mask: true
        })
        activityModel.getSingleActivityRecord(activityInfo.eventId).then(res => {
            activityInfo.detail = res
            activityInfo.showDetail = true
            this.setData({
                ['list[' + index + ']']: activityInfo
            })
            wx.hideLoading()
        })

    }
})