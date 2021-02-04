import { Setting } from '../setting-model.js'

var app = getApp()
var settingModel = new Setting()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        owner: {},
        newOwner: {},
        members: [],
        pageNo: 1,
        pageSize: 20,
        total: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //json文件配置失效
        wx.setNavigationBarTitle({
            title: '相册交接'
          })

        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffe329'
        })

        this.setData({
            owner: app.globalData.userInfo
        })

        this.getMembers()
    },

    getMembers(){
        settingModel.getMembers(this.data.pageNo, this.data.pageSize).then(res => {
            this.setData({
                members: [...this.data.members, ...res.result.list],
                total: res.result.total,
                pageNo: this.data.pageNo + 1
            })
        })
    },

    choose(e){
        var index = e.currentTarget.dataset.index
        this.setData({
            newOwner: this.data.members[index]
        })
    },

    complete(){
        if(this.data.newOwner.unionId && this.data.newOwner.unionId !== this.data.owner.unionId){
            settingModel.quitAlbum(1, this.data.newOwner.unionId).then(res => {
                app.globalData.isQuit = true
                wx.switchTab({
                    url: '/pages/album/checkin/checkin'
                })
            })
        }else{
            wx.showToast({
                title: '请选择新的主人',
                icon: 'none'
            })
        }
    }
})