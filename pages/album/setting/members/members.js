import { Setting } from '../setting-model.js'
import { Home } from '../../home/home-model.js'

var settingModel = new Setting()
var homeModel = new Home()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        members: [],
        owner: {},
        pageNo: 1,
        pageSize: 20,
        total: 0,
        isAuthor: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //json文件配置失效
        wx.setNavigationBarTitle({
            title: '全部'
            })

        wx.setNavigationBarColor({
            backgroundColor: '#ffffff',
            frontColor: '#000000'
        })

        this.setData({
            isAuthor: options.isAuthor == 1
        })
        this.showMore()
    },

    /**
     * 查看更多人员
     */
    showMore(){
        settingModel.getMembers(this.data.pageNo, this.data.pageSize).then(res => {
            // for (let index = 0; index < res.result.length; index++) {
                // const element = res.result[index]
                // if(element.unionId == app.globalData.activityInfo.unionId){
                //     this.setData({
                //         owner: element
                //     })
                // }
                this.setData({
                    total: res.result.total,
                    members: this.data.members.concat(res.result.list),
                    pageNo: this.data.pageNo + 1
                })
            // }
        })
    },

    /**
     * 跳转到他的个人首页
     */
    toPersonal(e){
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + e.currentTarget.dataset.id
        })
    },

    quit(){
        wx.showModal({
            title: '提示',
            content: '是否确认退出该相册',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if(result.confirm){
                    //如果是该相册的群主
                    if(this.data.isAuthor){
                        //该相册还有其他成员存在,进入群主转让页面
                         if(this.data.members.length > 1){
                             wx.navigateTo({
                                 url: './reselect/reselect'
                             })
                         }else{
                             homeModel.getRoomPhotos(1).then(res => {
                                 //该相册下是否存在图片
                                 if(res.result.Total > 0){
                                     wx.showToast({
                                         title: '退出失败，该相册下存在未删除图片',
                                         icon: 'none'
                                     })
                                 }else{
                                     settingModel.quitAlbum(1).then(res => {
                                        app.globalData.isQuit = true
                                         wx.switchTab({
                                             url: '/pages/album/checkin/checkin'
                                         })
                                     })
                                 }
                             })
                         }
                    }else{
                        settingModel.quitAlbum(0).then(res => {
                            app.globalData.isQuit = true
                             wx.switchTab({
                                 url: '/pages/album/checkin/checkin'
                             })
                        })
                    }
                }
            }
        })
    },

    goback(){
        wx.navigateBack({
            delta: 1
        })
    },

        /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: app.globalData.activityInfo.activityName,
            path: `/pages/album/home/home?room_no=${app.globalData.roomInfo.room_no}&fromShare=1`,
            imageUrl: app.globalData.activityInfo.bannerImg
        }
    },

        /**
     * 跳转到踢出成员页
     */
    toRemove(){
        wx.navigateTo({
            url: '../remove/remove'
        })
    }
})