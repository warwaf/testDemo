import activityModel from '../setting-model'

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        dialogStat: false,
        curIndex: false
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
        activityModel.getRelatedAcrivity().then(list => {
            this.setData({
                list
            })
        })
    },
    /**
     * 开启活动
     */
    enableActivity(e){
        var index = e.currentTarget.dataset.index, 
        eventId = this.data.list[index].eventId, 
        startTime =  this.data.list[index].startTime,
        tormorrow = new Date(new Date().toLocaleDateString()).getTime() + 3600 * 24 * 1000
        if(Date.parse(startTime) > tormorrow){
            wx.showToast({
               title: '该活动不能在当前时间开启',
               icon: 'none'
           })
           this.setData({
                ['list['+index+'].picked']: false
           })
           return
        }
        activityModel.changeState(eventId, 0).then(res => {
            //开启失败，当前有进行中的活动
            if(res.flag == 1){
                this.data.curIndex = index
                this.setData({
                    dialogStat: true,
                    ['list['+index+'].picked']: false
                })
            }else{
                this.setData({
                    ['list['+index+'].picked']: true
                })
            }
        })

    },

    disagree(){
        this.data.curIndex = false
        this.setData({
            dialogStat: false
        })
    },

    agree(){
        if(this.data.curIndex !== false){
            var eventId = this.data.list[this.data.curIndex].eventId
            activityModel.changeState(eventId, 3).then(res => {
                this.setData({
                    ['list['+this.data.curIndex+'].picked']: true,
                    dialogStat: false
                })
                this.data.curIndex = false
            })
        }
    },

    customizeActivity(){
        wx.navigateTo({
            url: '../customize/customize'
        })
    }
})