import { Home } from '../home/home-model.js'
import { Beauty } from '../beauty/beauty-model.js'
import { isLogin, generateCover } from '../../../utils/util.js'

var homeModel = new Home()
var beautyModel = new Beauty()
var praiseArr = []
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: [],
        curIndex: 0,
        fromShare: false,
        activityInfo: {},
        filterStat: false,
        avatars: [],
        sort: 2, //1: 精修图  0：原图 2：全部，
        pickState: 0, // true 选片 false 未选片 不传递字段 全部
        pickedArr: [],
        shareStat: false,
        filterResult: {},
        currentIndex: 0,
        praiseArr: [],
        isLoading: false,
        isShow: false, // 是否显示 提示
        reservateDate: '',
        //游客模式 
        anonymous: false,
        unregistered: false,
        optionIndex: 0,
        showShare: false,
        isAuthor: false,
        isEmpty: false,
        isShow: false,
        reservateDate: '',
        pathOptions: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        console.log("options >>", options)
        /**
         * pathOptions  区分新旧小程序码
         * 新小程序码参数带有N=1，room_no为ID用来换取正式的房间号
         */
        this.setData({
            pathOptions: options
        })
        if (this.data.pathOptions.N == 1) {
            homeModel.getActivityId(this.data.pathOptions.room_no).then(res => {
                console.log("获取ID -> 房间号：", res)
                app.globalData.roomInfo.room_no = res.result
                this.getBeautyList(res.result)
            })
        } else {
            this.getBeautyList(options.room_no)
        }
        //校验房间号
        if (options.room_no && options.room_no !== undefined && options.N != 1) {
            app.globalData.roomInfo.room_no = options.room_no
            app.globalData.roomConfig = []
        }

        if(options.shareType == '1'){
            return wx.redirectTo({
                url: `./film/film?status=1&fromShare=1`
            })
        }

        this.setData({ isLoading: true, fromShare: options.fromShare == '1'})

        // beautyModel.getBeautyList(options.room_no).then(list => {
        //     // var promiseArr = [],
        //     //     total = 0
        //     // for (let i = 0; i < list.length; i++) {
        //     //     total += list[i].pics.length
        //     //     list[i].status = true
        //     //     list[i].pics.forEach((item, index) => {
        //     //         list[i].pics[index].index = index
        //     //     })
        //     // }
        //     // this.data.total = total
        //     if(list && list.length > 0){
        //         this.setData({
        //             data: list,
        //             isLoading: false,
        //             isEmpty: false
        //         })
        //     }else{
        //         this.setData({
        //             isEmpty: true
        //         })
        //     }

        // })
        this.initPage()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        var data = {}
        if (this.data.pathOptions.N == 1) {
            let res = await homeModel.getActivityId(this.data.pathOptions.room_no)
            console.log("获取ID -> 房间号：", res)
            app.globalData.roomInfo.room_no = res.result
            data = await homeModel.getActivityInfo(res.result)
        } else {
            data = await homeModel.getActivityInfo()
        }
        await homeModel.getUnionid()
        this.setData({
            activityInfo: data,
            isAuthor: data.unionId == app.globalData.unionid
        })
        //导航栏标题
        wx.setNavigationBarTitle({
            title: `${data.activityName}` //（${activity_id}）
        })

    },

    async initPage(){
        try {
            await homeModel.getUnionid()
            this.data.fromShare && app.saveUserChannel(`相册分享`)
        } catch (error) {
            return this.setData({
                anonymous: true
            })
        }
        
        try {
            await homeModel.getUserPhoneByUnionId()
        } catch (error) {
            return this.setData({
                anonymous: true
            })
        }

        if(!app.globalData.userInfo.mobileNo){
            return this.setData({
                unregistered: true
            })
        }
        
        //注册
        homeModel.registered()
        //插入历史记录
        homeModel.addRecord()

    },

    getBeautyList(room_no){
        beautyModel.getBeautyList(room_no).then(list => {
            // var promiseArr = [],
            //     total = 0
            // for (let i = 0; i < list.length; i++) {
            //     total += list[i].pics.length
            //     list[i].status = true
            //     list[i].pics.forEach((item, index) => {
            //         list[i].pics[index].index = index
            //     })
            // }
            // this.data.total = total
            if(list && list.length > 0){
                this.setData({
                    data: list,
                    isLoading: false,
                    isEmpty: false
                })
            }else{
                this.setData({
                    isEmpty: true
                })
            }

        })
    },

    switchScene(e){
        this.setData({
            curIndex: e.currentTarget.dataset.index
        })
    },

    showDetail(e){
        var currentIndex = e.currentTarget.dataset.index
        app.globalData.photoArr = this.data.data[this.data.curIndex].pics
        wx.navigateTo({
            url: './detail/detail?index=' + currentIndex
        })
    },

    toFilm(){
        wx.redirectTo({
            url: `./film/film?fromShare=${this.data.fromShare ? 1 : 0}`
        })
    },

    toShare(){
        this.setData({ showShare: true })
    },

    changOption(e){
        this.setData({ optionIndex: Number(e.currentTarget.dataset.index) })
    },

    toRecycle(){
        wx.navigateTo({
            url: './recycle/recycle'
        })
    },

    toAr(){
        wx.navigateTo({
            url: '/pages/common/ar/ar'
        })
    },

    toSetting() {
        wx.navigateTo({
            url: '/pages/album/setting/setting?fromBeauty=2&isAuthor=' + this.data.isAuthor,
        })
    },

    closeMask(){
        this.setData({ showShare: false })
    },

    /**
     * 预约排程
     */
    appointment(e){
        // beautyModel.collectFormId(e.detail.formId)
        if(this.data.activityInfo.unionId == app.globalData.unionid){
            beautyModel.searchReservate().then(res => {
                if(res.meta.code == 0 && res.data.reservationsDate){
                   this.setData({
                        reservateDate:res.data.reservationsDate,
                        isShow: true
                   })
                }else{
                    wx.navigateTo({
                        url: '/pages/album/beauty/calendar/calendar?type=0',
                    })
                }
            })
        }else{
            wx.showToast({
                title: '只有管理员才能预约哦~',
                icon: 'none'
            })
        }
    },

    arrange(e) {
        wx.navigateTo({
            url: `/pages/common/beautyMessage/index?activityId=${app.globalData.activityInfo.activityId}&smart=1`,
        })
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        this.setData({ showShare: false })
        console.log(`/pages/album/beauty2/beauty2?room_no=${app.globalData.roomInfo.room_no}&fromShare=1&shareType=${this.data.optionIndex}`);
        return {
            title: `${this.data.activityInfo.activityName}`,
            path: `/pages/album/beauty2/beauty2?room_no=${app.globalData.roomInfo.room_no}&fromShare=1&shareType=${this.data.optionIndex}`,
            imageUrl: app.globalData.activityInfo.bannerImg
        }
    },

})