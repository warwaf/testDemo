import { Album } from './album-model.js'

const app = getApp()
var albumModel = new Album()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        albumList:[],
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(app.globalData.unionid){
            this.setData({ isLoading: true })
            albumModel.getActivityInfo().then(data => {
                this.setData({
                    albumList: data,
                    isLoading: false
                })
            })
        }
    },

    jump(event){
        var activityId = event.currentTarget.dataset['id'];
        wx.navigateTo({
            url: `/pages/album/home/home?room_no=${activityId}`,
        })
    }

})