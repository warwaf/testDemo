import { Home } from '../../../pages/album/home/home-model.js'
import { isRegistered } from '../../../utils/util.js'

var homeModel = new Home()
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        toolsConfig:{
            type:Object,
            observer(newVal, oldVal, changePath) {
                
            }
        },
        topIcon: {
            type: Boolean
        },
        btnStatus: {
            type: Object,
            observer(newVal, oldVal, changePath) {

            }
        },
        isadmin: {
            type: Boolean
        },
        isAuthor: {
            type: Boolean,
            value: false
        },
        activityInfo: {
            type: Object,
            observer(newVal, oldVal, changePath) {

            }
        },
        special: {
            type: Boolean,
            value: false
        },
        guidance: {
            type: Boolean | Number,
            value: false
        },
        type: {
            type: Number,
            value: 0
        },
        visiable: {
            type: Boolean,
            value: true
        }
    },

    externalClasses: [
        'tool-class'
    ],

    /**
     * 组件的初始数据
     */
    data: {
        puzzle: false,
        divideStat: false,
        settings: app.globalData.activityInfo.settings,
        showLive: false
    },
    lifetimes: {
        ready() {
            this.setData({
                showLive: ["hc-f-860864","hc-f-668367","hc-f-504346","hc-f-549869","hc-f-637485","hc-f-456915","hc-f-659357"].indexOf(app.globalData.roomInfo.room_no) != -1
            })
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        tapTools(e){
            const { info } = e.currentTarget.dataset;
            if(info.redirectUrl){
                wx.navigateTo({
                    url: `${info.redirectUrl}?${info.param}`
                })
            }else{
                switch(info.name){
                    case 'top':  this.triggerEvent('backTop', {})
                    break;
                    case 'puzzle':  this.setData({  puzzle: true })
                    break;
                    case 'share':  this.triggerEvent('share', {})
                    break;
                    case 'subscribe':  this.triggerEvent('subscribe')
                    break;
                    case 'thankgivingPuzzle':  
                        app.globalData.thanksgiving = true
                        this.triggerEvent('puzzle', { type: '2' })
                    break;
                    case 'thankgiving': 
                        wx.navigateTo({
                            url: '/activity/thanksgiving/thanksgiving'
                        })
                    break;
                }
            }
        },
        scrollToTop() {
            this.triggerEvent('backTop', {})
        },

        toSenior() {
            wx.navigateTo({
                url: `/pages/webview/beauty/beauty?activity_id=${this.properties.activityInfo.activityId}`,
            })
        },

        toSeek(e) {
            wx.navigateTo({
                url: `/pages/album/search/search?activityId=${this.properties.activityInfo.activityId}`,
            })
        },

        toAr() {
            wx.navigateTo({
                url: '/pages/common/ar/ar',
            })
        },

        toMine() {
            wx.switchTab({
                url: '/pages/mine/home/mine',
            })
        },

        toPuzzle: function(e) {
            this.triggerEvent('puzzle', {
                type: e.currentTarget.dataset.type
            })
            // this.triggerEvent('puzzle', {
            //     count: e.currentTarget.dataset.id === "1" ? 9 : 1
            // })
        },

        toShare: function() {
            this.triggerEvent('share', {})
        },

        toUpload: function() {
            if (app.globalData.uploadArr.length > 0 && !app.globalData.uploadCompleted) {
                wx.showToast({
                    title: '提交的图片还在上传中，请稍后再试',
                    icon: 'none'
                })
                return
            }
            isRegistered().then(res => {
                if (res) {
                    wx.navigateTo({
                        url: '/pages/album/upload/upload',
                    })
                }
            })
        },

        cancleSelect: function() {
            this.setData({
                puzzle: false
            })
        },

        startPuzzle: function() {
            this.setData({
                puzzle: true
            })
            // this.triggerEvent('puzzle', {
            //     count: 9
            // })
        },
        todiy: function() {
            this.triggerEvent('diy', {})
        },
        toSubscribe() {
            this.triggerEvent('subscribe')
                // wx.navigateTo({
                //     url: '/pages/album/subscribe/present/present',
                // })
        },
        divide() {
            wx.navigateTo({
                url: '/pages/album/diy/cy/cy'
            })
        },
        thirty() {
            wx.navigateTo({
                url: '/activity/anniversary/anniversary?id=54'
            })
        },
        //加盟商活动
        to_724_activity(){
            var path = 'https://m.xm520.com/activity/guafen1/activity-724.html'
            wx.navigateTo({
                url: `/pages/webview/webview?path=${path}`
            });
        },
        //抽奖页面
        toLottery(){
            wx.navigateTo({
                url: '/activity/lottery/lottery'
            })
        },
        //拉新
        toInvitation(){
            wx.navigateTo({
                url: '/pages/webview/invite/invite'
            })
        },
        //签到
        toCheckIn(){
            wx.navigateTo({
                url: '/activity/checkin/checkin'
            })
        },
        //直播活动
        toLive(){
            wx.navigateTo({
                url: '/activity/live/live'
            })
        },
        toInvitation(){
            wx.navigateTo({
                url: '/activity/invitation/invitation'
            })
        },
    }
})