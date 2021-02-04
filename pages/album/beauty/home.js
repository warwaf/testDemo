import { Home } from '../home/home-model.js'
import { Beauty } from './beauty-model.js'
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
        fromShare: false,
        activityInfo: {},
        isAuthor: true,
        manuStat: true,
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
        pathOptions: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("options >>", options)
        /**
         * pathOptions  区分新旧小程序码
         * 新小程序码参数带有N=1，room_no为ID用来换取正式的房间号
         */
        this.setData({
            pathOptions: options
        })
        if (options.N == 1) {
            homeModel.getActivityId(this.data.pathOptions.room_no).then(res => {
                console.log("获取ID -> 房间号：", res)
                app.globalData.roomInfo.room_no = res.result
                this.getBeautyList(res.result)
                this.getFilterAvatars(res.result)
            })
        } else {
            this.getBeautyList(options.room_no)
            this.getFilterAvatars(options.room_no)
        }
        //校验房间号
        if (options.room_no && options.room_no !== undefined && options.N != 1) {
            app.globalData.roomInfo.room_no = options.room_no
            app.globalData.roomConfig = []
        }

        //来自于分享
        if(options.fromShare){
            this.setData({ fromShare: true })
        }

        this.setData({ isLoading: true })
        // beautyModel.getBeautyList(options.room_no).then(list => {
        //     var promiseArr = [],
        //         total = 0
        //     for (let i = 0; i < list.length; i++) {
        //         total += list[i].pics.length
        //         list[i].status = true
        //         list[i].pics.forEach((item, index) => {
        //             list[i].pics[index].index = index
        //         })
        //     }
        //     this.data.total = total
        //     this.setData({
        //         data: list,
        //         isLoading: false
        //     })
        // })

        // beautyModel.getFilterAvatars().then(res => {
        //     this.setData({
        //         avatars: res.result
        //     })
        // })

        this.initPage()
    },

    async onShow() {
        //从授权页面返回,如果仍未获取到手机号-->直接返回首页
        if(app.globalData.fromAuthorize){
            app.globalData.fromAuthorize = false
            if(!app.globalData.userInfo.mobileNo){
                wx.switchTab({
                    url: '/pages/album/checkin/checkin'
                })
                return
            }
        }

        if (praiseArr.length > 0) {
            this.setData({
                praiseArr
            })
        }
        praiseArr = []
        if (this.data.pathOptions.N == 1) {
            let res = await homeModel.getActivityId(this.data.pathOptions.room_no)
            console.log("获取ID -> 房间号：", res)
            app.globalData.roomInfo.room_no = res.result
            //获取房间活动信息
            homeModel.getActivityInfo(res.result).then(data => {
                this.setData({
                    activityInfo: data,
                    isAuthor: data.unionId == app.globalData.unionid,
                    showSubscribe: wx.getStorageSync('subscribleBeauty') != '1' ? (data.unionId == app.globalData.unionid) : false
                })
                //导航栏标题
                wx.setNavigationBarTitle({
                    title: `${data.activityName}` //（${activity_id}）
                })
            })
        } else {
            //获取房间活动信息
            homeModel.getActivityInfo().then(data => {
                this.setData({
                    activityInfo: data,
                    isAuthor: data.unionId == app.globalData.unionid,
                    showSubscribe: wx.getStorageSync('subscribleBeauty') != '1' ? (data.unionId == app.globalData.unionid) : false
                })
                //导航栏标题
                wx.setNavigationBarTitle({
                    title: `${data.activityName}` //（${activity_id}）
                })
            })
        }
        //获取房间活动信息
        // homeModel.getActivityInfo().then(data => {
        //     this.setData({
        //         activityInfo: data,
        //         isAuthor: data.unionId == app.globalData.unionid,
        //         showSubscribe: wx.getStorageSync('subscribleBeauty') != '1' ? (data.unionId == app.globalData.unionid) : false
        //     })
        //     //导航栏标题
        //     wx.setNavigationBarTitle({
        //         title: `${data.activityName}` //（${activity_id}）
        //     })
        // })
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
    getFilterAvatars(room_no) {
        beautyModel.getFilterAvatars(room_no).then(res => {
            this.setData({
                avatars: res.result
            })
        })
    },
    getBeautyList(room_no) {
        beautyModel.getBeautyList(room_no).then(list => {
            var promiseArr = [],
                total = 0
            for (let i = 0; i < list.length; i++) {
                total += list[i].pics.length
                list[i].status = true
                list[i].pics.forEach((item, index) => {
                    list[i].pics[index].index = index
                })
            }
            this.data.total = total
            this.setData({
                data: list,
                isLoading: false
            })
        })
    },
    switchStatus(e) {
        var currentIndex = e.currentTarget.dataset.index
        this.setData({
            ['data[' + currentIndex + '].status']: !this.data.data[currentIndex].status
        })
    },

    switchFilter(e) {
        var id = e.currentTarget.dataset.id
        this.data.filterResult = e.currentTarget.dataset.item
        if (id) {
            this.setData({
                filterStat: true
            })
        } else {
            this.setData({
                filterStat: false
            })
        }
    },

    switchSort(e) {
        var sort = e.currentTarget.dataset.sort
        this.setData({
            sort
        })
    },
    switchPick(e){
        var pick = e.currentTarget.dataset.pick;
        this.setData({
            pickState: pick
        })
    },
    pickAvatar(e) {
        var index = e.currentTarget.dataset.index
            //全选
        if (index == -1) {
            var type = this.data.avatars.every(item => item.picked)
            this.data.pickedArr = []
            this.data.avatars.forEach((avatar, index) => {
                this.data.avatars[index].picked = !type
                this.data.pickedArr.push(this.data.avatars[index].unionId)
            })
            this.data.pickedArr = type ? [] : this.data.pickedArr
            this.setData({
                avatars: this.data.avatars
            })

        } else {
            if (this.data.pickedArr.indexOf(this.data.avatars[index].unionId) !== -1) {
                this.data.pickedArr.splice(this.data.pickedArr.indexOf(this.data.avatars[index].unionId), 1)
                this.setData({
                    ['avatars[' + index + '].picked']: false
                })
                return
            }
            this.data.pickedArr.push(this.data.avatars[index].unionId)
            this.setData({
                ['avatars[' + index + '].picked']: true
            })
        }
    },
    toAr(){
        wx.navigateTo({
            url: '/pages/common/ar/ar'
        })
    },
    toDetail(event) {
        var currentIndex = event.detail.index
        app.globalData.photoArr = this.data.data[currentIndex].pics
        wx.navigateTo({
            currentIndex,
            url: '/pages/album/beauty/detail/detail?index=' + event.detail.position,
        })

    },

    toEvaluateList() {
        wx.navigateTo({
            url: 'list/list',
        })
    },

    toSetting() {
        wx.redirectTo({
            url: '/pages/album/setting/setting?fromBeauty=1&isAuthor=' + this.data.isAuthor,
        })
    },

    toFilter(e) {
        const { pickedArr, sort, filterResult, pickState } = this.data;
        beautyModel.getImagesViaUnionId(pickedArr, sort, filterResult.name, pickState).then(res => {
            this.data.filterResult.pics = res.result
            app.globalData.filterResult = this.data.filterResult
            wx.navigateTo({
                url: './filterResult/filterResult',
            })
        })
    },

    praise(picId, praiseCount) {
        praiseArr.push({
            picId,
            praiseCount
        })
    },

    /**
     * 显示分享弹窗
     */
    switchShareStat(e) {
        beautyModel.collectFormId(e.detail.formId);
        this.setData({
            shareStat: !this.data.shareStat
        })
    },
    thirty() {
        wx.navigateTo({
            url: '/activity/anniversary/anniversary?id=54'
        })
    },
    /**
     * 跳转到产品页面
     */
    showProducts(e){
        beautyModel.collectFormId(e.detail.formId);
        if(app.globalData.userInfo.mobileNo){
            wx.navigateTo({
                url: '/beauty/pages/products/products'
            })
        }else{
            this.setData({
                tipsForPhoneStat: true
            })
        }
    },

    toSetting(e){
        beautyModel.collectFormId(e.detail.formId)
        wx.redirectTo({
            url: `/pages/album/setting/setting?isAuthor=${this.data.isAuthor ? 1 : 0}&fromBeauty=1`,
        })
    },

    toInvitation(){
        wx.navigateTo({
            url: '/activity/invitation/invitation'
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var roomBrowseCount = app.globalData.activityInfo.browseCount
        if (roomBrowseCount > 9999) {
            roomBrowseCount = '9999+'
        } else if (roomBrowseCount > 999) {
            roomBrowseCount = '999+'
        }
        return {
            title: `【${app.globalData.activityInfo.activityName}】 有${this.data.total}张照片，共${roomBrowseCount}次浏览`,
            path: `/pages/album/beauty/home?room_no=${app.globalData.roomInfo.room_no}&fromShare=1`,
            imageUrl: app.globalData.activityInfo.bannerImg
        }
    },
    /**
     * 返回
     */
    goback(e) {
        beautyModel.collectFormId(e.detail.formId)
        wx.switchTab({
            url: '/pages/album/checkin/checkin',
        })
    },

    jumpMessage(e) {
        beautyModel.collectFormId(e.detail.formId)
        wx.navigateTo({
            url: '/pages/common/beautyMessage/index?activityId=' + app.globalData.activityInfo.activityId,
        })
    },
    downloadQrcode() {
        var ctx = wx.createCanvasContext('qrcode', this)
        app.globalData.activityInfo.total = this.data.total
        generateCover(app.globalData.activityInfo, ctx)
            // downloadImage(app.globalData.activityInfo.qrcodeImg)
    },

    /**
     * 关闭提示
     */
    cancle(){
        this.setData({ isShow:false })
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

    except(e) {
        beautyModel.collectFormId(e.detail.formId)
        wx.navigateTo({
            url: '/pages/album/beauty/scene/scene?path=123',
        })
    },

    userInfoEvent(){
        this.setData({
            anonymous: false
        })
        this.initPage()
    },

    userPhoneEvent(){
        this.setData({
            unregistered: false
        })
        this.initPage()
    },

    subscribe(){
        var tmplIds = ['me3Rva7zZ6FTZrS9uhHZvPcRqSI8cPi4ZX6YbPjt-Dg', '88GlJBArDKeeCjUZUPdCYb11oTqx5Bu6rSh7SW5uS14', 'h2CmOIhTaGqL0XFCkyzDV59JV_gZeRpZ5WyqPiUMPbs']
        if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
            tmplIds = ['me3Rva7zZ6FTZrS9uhHZvPcRqSI8cPi4ZX6YbPjt-Dg', '88GlJBArDKeeCjUZUPdCYb11oTqx5Bu6rSh7SW5uS14', 'h2CmOIhTaGqL0XFCkyzDV59JV_gZeRpZ5WyqPiUMPbs']
        }
        wx.requestSubscribeMessage({
            tmplIds,
            complete: () => {
                wx.setStorageSync('subscribleBeauty', '1')
                this.setData({
                    showSubscribe: false
                })
            }
        })
    },

    hideSubscribe(){
        this.setData({
            showSubscribe: false
        })
    },

    stop() {
        return
    }
})