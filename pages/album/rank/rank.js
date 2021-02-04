// pages/rank/rank.js
import { generateCover, isLogin } from '../../../utils/util'
import { Rank } from './rank-model.js'
import { Home } from '../home/home-model.js'

var rankModel = new Rank()
var homeModel = new Home()
var app = getApp()
var photoArr = []
Page({

    loadTimer: null,
    /**
     * 页面的初始数据
     */
    data: {
        activityInfo: {},
        bigImgArr: [],
        photo: {},
        //tab栏
        showDetail: false,
        finished: false,
        page: 1,
        size: 30,
        photoTotal: 0,
        //tool
        btnStatus: {},
        toolStatus: true,
        rocketStat: false,
        empty: false,
        room_no: 0,
        groupArr: [],
        curGroupName: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        photoArr = []
        //导航栏标题
        wx.setNavigationBarTitle({
            title: `${app.globalData.activityInfo.activityName}（${app.globalData.activityInfo.activityId.split('-')[2]}）`
        })
        this.setData({
            room_no: options.room_no,
            activityInfo: app.globalData.activityInfo,
        })

        wx.hideShareMenu()

        //判断是否为该相册作者
        if (app.globalData.activityInfo.unionId == app.globalData.unionid) {
            this.setData({
                isAuthor: true,
            })
        }
        //加载图片
        this._loadPhotos()

        homeModel.getRoomPhotos(1, 1).then(res => {
            this.setData({
                photoTotal: res.result.Total
            })
        })

        homeModel.getGroupInfo().then(res => {
            const groupArr = res.result || []
            this.setData({ 
                groupArr,
                curGroupName: options.curGroupName
            })
        })
    },

    showDetail: function(event) {
        var currentIndex = event.detail.index
        getApp().globalData.photoArr = photoArr
        rankModel.addPicHot(photoArr[currentIndex].picId, 1)
        wx.navigateTo({
            url: `/pages/album/detail/detail?index=${currentIndex}&room_no=${this.data.room_no}`
        })
    },

    _loadPhotos() {
        if (this.data.loading) return
        this.data.loading = true
        rankModel.getRank(this.data.page++, this.data.size).then(res => {
            var data = res.result.list
            if (data == null && --this.data.page == 1) {
                this.setData({
                    empty: true,
                    finished: true
                })
                return
            }

            data.forEach((item, index) => {
                data[index].picId = item.pic_id
                data[index].picUrl = item.pic_url
            })
            photoArr = photoArr.concat(data)

            this.setData({
                photo: data,
                finished: true
            })
            this.data.loading = false
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this._loadPhotos();
    },

    /**
     * 返回顶部
     */
    backTop: function() {
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },
    /**
     * 开始拼图
     */
    startPuzzle: function(event) {
        this.setData({
            puzzling: true,
            maxPuzzleNum: event.detail.count,
            toolStatus: false
        })
    },

    showTool: function() {
        this.setData({
            toolStatus: true
        })
    },

    toPriseRank() {
        wx.redirectTo({
            url: `/pages/album/rank/rank?room_no=${this.data.room_no}`
        })
    },

    toHome() {
        wx.redirectTo({
            url: `/pages/album/home/home?room_no=${this.data.room_no}`
        })
    },

    toSetting() {
        wx.redirectTo({
            url: '/pages/album/setting/setting',
        })
    },

    /**
     * diy列表
     */
    showDiy() {
        if (isLogin()) {
            // wx.navigateTo({
            //     url: `/pages/album/diy/proList/proList?quantity=1`,
            // })
            wx.navigateTo({
                url: `/pages/album/diy/diy`,
            })
        }
    },

    onPageScroll: function(e) {
        if (e.scrollTop <= 200 && this.data.rocketStat == true) {
            this.setData({
                rocketStat: false
            })
        }
        if (e.scrollTop > 200 && this.data.rocketStat == false) {
            this.setData({
                rocketStat: true
            })
        }
    },

    /**
     * 显示分享弹窗
     */
    showShare() {
        this.setData({
            shareStat: true
        })
    },

    hideMask() {
        this.setData({
            shareStat: false
        })
    },

    downloadQrcode() {
        var ctx = wx.createCanvasContext('qrcode', this)
        app.globalData.activityInfo.total = this.data.photoTotal
        generateCover(app.globalData.activityInfo, ctx)
    },

    groupItemClickHandler(e){
        wx.redirectTo({
            url: `/pages/album/home/home?room_no=${this.data.room_no}&curGroupName=${this.data.groupArr[e.currentTarget.dataset.index].classification}`
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        // return {
        //     title: app.globalData.activityInfo.activityName,
        //     path: `/pages/album/home/home?room_no=${app.globalData.roomInfo.room_no}&fromShare=1`,
        //     imageUrl: app.globalData.activityInfo.bannerImg
        // }
        return {
            title: `【${app.globalData.activityInfo.activityName}】 有${this.data.photoTotal}张照片，共${234}次浏览`,
            path: `/pages/album/home/home?room_no=${app.globalData.roomInfo.room_no}&fromShare=1`,
            imageUrl: app.globalData.activityInfo.bannerImg
        }
    }

})