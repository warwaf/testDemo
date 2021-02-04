// pages/home/home.js
import { generateCover, isLogin,parseQueryString,sharePyq } from '../../../utils/util'
import { Home } from './home-model.js'
import { Setting } from '../setting/setting-model'
import { Subscribe } from '../subscribe/subscribe-model';
import apiSettings from '../../../utils/ApiSetting.js'
import { Upload } from '../upload/upload-model'
var homeModel = new Home()
var subscribe = new Subscribe()
var settingModel = new Setting()
var uploadModel = new Upload()


const app = getApp()

//保存房间所有图片,分页数据从此数组中取
var photoArr = [], timer = null

Page({
    /**
     * 页面的初始数据
     */
    data: {
        couponData: [],//领取优惠券数据
        couponList: [],//领取优惠券列表
        receiveDialog: false,//领券弹窗
        receive: 1,
        banUser: false,
        banUserList: [
            'oYnHqswdL-N04otGRD09LZmBaf9Q',
            'oYnHqs4-RpyUq5WJmNwp9OXQqngw',
            'oYnHqsz9lP4qF0IWuLQDxgOqAWBQ',
            'oYnHqsyWKwCrZTw9F6_bYDbc0wgs',
            'oYnHqszhyiB9a2ApOimycuNlLHsY',
            'oYnHqs7mjCouYgeHiD_8RpqfkbiU',
            'oYnHqs9YtxsbCnT8bo3N9LFjLfVU',
            'oYnHqsyDxgIkekFFM1J98FXRqODg',
            'oYnHqszU_TQveVgltsUClBkY_ct8',
            // 'oYnHqs0l6eWZ-ZkddJMiYQUijWVs',//本人的
        ],
        state: '',
        //分享
        activityInfo: {},
        bannerUrl: '',
        fromShare: false,
        //tab栏
        menuStat: true,
        photoTotal: 0,
        currentTotal: 0,
        calendar: false,
        //瀑布流相关
        showWaterFall: true,
        photo: {},
        page: 1, //加载图片页数
        size: 30,
        preloadPage: 1,
        pageNo: 1, //加载数据页数
        isLoading: true,
        puzzling: false,
        maxPuzzleNum: 9,
        //时间轴
        datePhotoArr: [],
        //tool
        toolStatus: true,
        isAuthor: false,
        showTools: true,
        //集福
        isEmpty: false,
        //分享弹窗
        shareStat: false,
        fromCreate: true,
        //预约人数
        appointment: 0,
        //上传按钮
        uploadBtn: false, // 1--正在上传中 2-领取红包 4--敏感图片
        // degree: 0,
        uploadTotal: 0,
        uploadAlready: 0,   //已完成数量
        illegalCounter: 0,  //非法图片数量
        allowUpload: true,
        //红包
        showVouchers: false,
        voucherValue: "0.00",
        //设置密钥
        password: '',
        isEdit: false,
        passwordSession: false,
        //优惠券
        showCoupon: false,
        couponVal: 0,
        // 队列加载
        queueLoading: [],
        // 冲印优惠券
        cyCoupon: [{ name: 'roli', value: 30 }, { name: 'roli1', value: 30 }, { name: 'roli2', value: 30 }, { name: 'roli3', value: 30 }, { name: 'roli4', value: 30 }, { name: 'roli5', value: 30 }],
        showCyCoupon: true,
        couponInfo: {},
        //新手指引
        guidance: false,
        anonymous: false,
        //海报弹窗
        posterStat: false,
        toolsConfig:{},
        showSubscribe: false,
        //分组
        curGroupName: '',
        groupArr: [],
        showGroupList: false,
        uploadSelectGroupName: '',
        groupSelector: false,
        pathOptions: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // sharePyq()//分享朋友圈
        if(options.scene){
            options = parseQueryString(decodeURIComponent(decodeURIComponent(options.scene)))
        }
        console.log("DE options >>", options)
        this.options = options
        /**
         * pathOptions  区分新旧小程序码
         * 新小程序码参数带有N=1，room_no为ID用来换取正式的房间号
         */
        this.setData({
            pathOptions: options
        })
        //校验房间号
        if (options.room_no && options.N != 1) {
            app.globalData.roomInfo.room_no = options.room_no
            //感恩节标识
            app.globalData.cardType = options.cardType
            app.globalData.roomConfig = []
            this.data.isFresh = true
        }

        //来自于分享
        app.globalData.fromShare = Boolean(options.fromShare) || app.globalData.fromShare

        //扫码进来也要展示home键
        this.setData({
            room_no: app.globalData.roomInfo.room_no,
            fromShare: Boolean(options.fromShare) || app.globalData.fromShare,
            fromCreate: Boolean(options.fromCreate)
        })

        options.fromCreate && this.openPackage()

        //获取unionId
        try {
            await homeModel.getUnionid()
        } catch (error) {
            this.setData({
                anonymous: true
            })
        }

        options.fromShare && app.saveUserChannel(`相册分享`)

        homeModel.getGroupInfo().then(res => {
            const groupArr = res.result || []
            this.setData({ 
                groupArr,
                curGroupName: options.curGroupName || (groupArr[0] ? groupArr[0].classification : '默认'),
                showGroupList: wx.getStorageSync('groupMenuStyle') == '1'
            })
            this.reflesh()
        })

        if (options.room_no && app.globalData.unionid) {
            //注册
            homeModel.registered()
        }

        //获取用户信息
        try {
            await homeModel.getUserPhoneByUnionId()
        } catch (error) {
            this.setData({
                anonymous: true
            })
        }
        this.setData({
            state:app.globalData.userInfo.state==2?false:true
        })
        console.log(app.globalData.activityInfo, 'globalData777')
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (app.globalData.fromDetail === true) {
            this.reflesh()
            app.globalData.fromDetail = false
            this.setData({
                uploadTotal: app.globalData.uploadArr.length
            })
        }
        this.setData({ puzzling: false })
        this._uploadListener()
        this._initRoomConfig()
    },
    /**
     * 初始化房间信息
     */
    async _initRoomConfig(){
        var data = {}
        if (this.data.pathOptions.N == 1) {
            let res = await homeModel.getActivityId(this.data.pathOptions.room_no)
            console.log("获取ID -> 房间号：", res)
            app.globalData.roomInfo.room_no = res.result
            data = await homeModel.getActivityInfo(res.result)
        } else {
            data = await homeModel.getActivityInfo()
        }
        //电商相册跳转到授权页
        timer = setInterval(() => {
            if(app.globalData.userInfo && JSON.stringify(app.globalData.userInfo) != '{}'){
                clearInterval(timer)
                if(data.type == 8 && data.unionId == 'oYnHqs11e9b23f-00163e0016ec'){
                    return wx.redirectTo({
                        url: `../e-commerce/e-commerce?room_no=${this.data.room_no}&fromAr=1`
                    })
                }
            }
        }, 500)
        console.log('data.watermarkImg',data,data.watermarkImg)
        //如果有上传水印则替换默认水印,没有设置水印则重新设置默认水印
        if(data && data.watermarkImg){
            let str = data.watermarkImg.substring(0,5)
            if (str=='https') {
                app.globalData.waterMark = data.watermarkImg.replace('https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/', '')
            } else {
                app.globalData.waterMark = data.watermarkImg.replace('http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/', '')
            }
            console.log(app.globalData.waterMark, 'app.globalData.waterMark')
        }else{
            app.globalData.waterMark = 'vedio_test/24.png'
        }
        this.setData({
            activityInfo: data
        })
        console.log(app.globalData, 'globalData')
        this.data.banUserList.forEach(element => {
            if (element==app.globalData.unionid||element==this.data.activityInfo.unionId) {
                wx.hideShareMenu()
                this.setData({
                    banUser: true
                })
            }
        });
        //密码不为空情况下校验权限
        if (data.password) {
            homeModel.judgePermission().then(res => {
                if (!res) {
                    //权限不通过，要求输入密码
                    this.setData({
                        passwordSession: true
                    })
                } else {
                    homeModel.addRecord()
                }
            })
        } else {
            homeModel.addRecord()
            //新手指引
            if (!wx.getStorageSync('guidance-home')) {
                this.setData({
                    guidance: 1
                })
                wx.setStorageSync('guidance-home', 1)
            }
        }

        //导航栏标题
        wx.setNavigationBarTitle({
            title: `${data.activityName}` 
        })

        //当前房间有抽奖活动正在进行
        if(data.activityPrize && data.activityPrize.state == 0 && this.data.isFresh){
            //是否在此相册评论过，没有则弹出提示框                
            if(!wx.getStorageSync('comment-' + data.activityId) || !wx.getStorageSync('upload-' + data.activityId)){
                this.setData({
                    lotteryStat: true
                })
            }
        }

        // 1001 开始 优惠券 - 新
        // 获取优惠券配置信息
        const toolsConfig = await homeModel.getToolsConfig();
        this.setData({
            toolsConfig: toolsConfig.result
        })
        // 设置配置信息
        app.globalData.activityInfo.settings = toolsConfig.result;
        // 如果有配置优惠券信息 且 不是冲印
        if(toolsConfig.result.activityDetail && this.data.isFresh){
            const coupon = await homeModel.getConpon();
            if(coupon.code == 200){
                this.setData({
                    showCoupon: 1,
                    couponVal:  coupon.result.CouponType,
                    couponInfo: toolsConfig.result.activityDetail
                })
            }
        }

        //海报
        if(data.activityPosterDetail && this.data.isFresh){
            this.setData({
                posterStat: true
            })
        }

        if(this.data.isFresh){
            await homeModel.getUnionid()
            this.setData({
                isAuthor: data.unionId == app.globalData.unionid,
                allowUpload: data.unionId == app.globalData.unionid ? true : Boolean(data.powerType)
            })
        }

        this.data.isFresh = false

        if(data.unionId == app.globalData.unionid){
            wx.getStorageSync('subscribleRoom') == '1' || this.setData({
                showSubscribe: true
            })
        }
        this.getActivityCoupon()
    },
    getActivityCoupon () {
        console.log(app.globalData, 'globalData')
        wx.request({
          url: apiSettings.getActivityCoupon,
          data: {
            activityId: app.globalData.activityInfo.activityId,
            unionId: app.globalData.userInfo.unionId
          },
          header: {
            "Content-Type": "application/json",
          },
          method: "POST",
          success: res => {
              console.log(res, 'res<<<1111')
              if (res.data.code==200) {
                this.setData({
                    receiveDialog: res.data.result.success,
                    couponList: res.data.result.fileList,
                    couponData: res.data.result.fileList[0]
                })
              }
          }
        })
    },
    //领取优惠券弹窗
    getClose () {
        this.setData({
            receiveDialog: false,
        })
    },
    // 领取优惠券
    getReceive () {
        let _this = this
        wx.request({
          url: apiSettings.takeActivityTaCoupon,
          data: {
            activityId: app.globalData.activityInfo.activityId,
            unionId: app.globalData.userInfo.unionId
          },
          header: {
            "Content-Type": "application/json",
          },
          method: 'POST',
          success: res => {
              if (res.data.code == 200) {
                _this.setData({
                    couponData: _this.data.couponList[1]
                })
              } else {
                _this.setData({
                    couponData: _this.data.couponList[2]
                })
              }
              console.log(res, 'res<<<<<')
          }
        })
    },
    /**
     * 分页加载图片数据
     */
    _loadPhotoData() {
        return new Promise((resolve, reject) => {
            homeModel.getRoomPhotos(this.data.curGroupName, this.data.pageNo++, this.data.size * 3).then(res => {
                if (this.data.pageNo == 2) {
                    //判断相册是否为空
                    if (res.result.Photos.length == 0) {
                        var illegalCounter = app.globalData.uploadArr.reduce((accumulator, currentVal) => currentVal.legal ? accumulator : accumulator + 1, 0)
                        this.setData({
                            isEmpty: true
                            // isEmpty: illegalCounter == 0
                        })
                        resolve()
                        return
                    } else {
                        this.setData({
                            isEmpty: false
                        })
                    }
                }
                this.setData({
                    photoTotal: res.result.Total,
                    isLoading: false
                })
                app.globalData.photoTotal = res.result.Total
                //把全部图片暂存
                photoArr = photoArr.concat(res.result.Photos)
                setTimeout(() => {
                    if(this.data.activityInfo.bannerImg.includes('hcmtq.oss-cn-hangzhou.aliyuncs.com/Banner')){
                        this._changeBanner(res.result.Photos)
                    }
                }, 2000)
                resolve()
            })
        })
    },

    async _changeBanner(data){
        // wx.showLoading({ mask: true })
        var target = data.find(item => (Number(item.picWidth) / Number(item.picHeight)) > 0.5 && (Number(item.picWidth) / Number(item.picHeight)) < 3)
        if(!target) return
        var imgInfo = await homeModel.getImageSize(target.thumbnailUrl2)
        target.picHeight = Number(imgInfo.height)
        target.picWidth = Number(imgInfo.width)
        var ctx = wx.createCanvasContext('banner', this)
        ctx.clearRect(0, 0, 336, 168)
        var startX = 0, startY = 0, imgWidth = 336, imgHeight = 168, diff = target.picWidth - 2 * target.picHeight
        
        if(diff >= 0){
            startX = (target.picWidth - (target.picHeight * 2)) / 2
            imgWidth = 2 * target.picHeight
            imgHeight = target.picHeight
        }else{
            startY = (target.picHeight - (target.picWidth / 2)) / 2
            imgWidth = target.picWidth
            imgHeight = target.picWidth / 2
        }
        var that = this
        wx.downloadFile({
            url: target.thumbnailUrl2,
            success: (result)=>{
                ctx.drawImage(result.tempFilePath, startX, startY, imgWidth, imgHeight, 0, 0, 336, 168)
                ctx.draw(false, () => {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: 336,
                        height: 168,
                        destWidth: 336,
                        destHeight: 168,
                        canvasId: 'banner',
                        success(res) {
                            app.uploadImage(res.tempFilePath).then(res =>{
                                app.globalData.activityInfo.bannerImg = res.OssPath
                                app.globalData.activityInfo.publicityImg = res.OssPath
                                that.setData({ 'activityInfo.bannerImg': res.OssPath, 'activityInfo.publicityImg': res.OssPath })
                                settingModel.updateActivityRoom({ 
                                    id: that.data.activityInfo.id, 
                                    bannerImg: res.OssPath,
                                    publicityImg: res.OssPath
                                }).then(() => {
                                    // wx.hideLoading()
                                }).catch(() => {
                                    // wx.hideLoading()
                                })
                            })
                        },
                        fail(){
                            // wx.hideLoading()
                        }
                    })
                })
            },
            fail: ()=> {
                wx.hideLoading()
            }
        })
    },

    /**
     * 瀑布流加载图片
     */
    _loadPhotos: function() {
        //避免重复加载
        if (this.data.isLoading === true || photoArr.length == this.data.currentTotal || this.data.currentTotal == photoArr.length) return
        this.data.isLoading = true
        var imgsArr = photoArr.slice((this.data.page - 1) * this.data.size, this.data.page * this.data.size)
        this.setData({
            photo: imgsArr
        })
        this.data.page += 1
        this.setData({
            currentTotal: this.data.currentTotal + imgsArr.length
        })
        this.data.isLoading = false
            //预加载
        if (--this.data.preloadPage >= 0) {
            this._loadPhotos()
        }
    },

    /**
     * 装载数据根据时间轴
     */
    _loadDatePhotoArr() {
        homeModel.getPhotosGroupByDate().then(data => {
            this.setData({
                datePhotoArr: data
            })
        })
    },


    /*************分组部分***************/

    groupItemClickHandler(e){
        if(this.data.puzzling) return
        this.setData({
            showGroupList: false,
            curGroupName: this.data.groupArr[e.currentTarget.dataset.index].classification,
            calendar: false
        })
        this.reflesh()
    },

    showGroupListHandler(){
        if(this.data.puzzling) return
        this.setData({
            showGroupList: true
        })
    },

    updateGroups(){
        homeModel.getGroupInfo().then(res => {
            const groupArr = res.result || []
            this.setData({ groupArr })
        })
    },

    /*************分组部分end***************/

    /**
     * 跳转到详情页
     */
    showDetail: function(event) {
        var currentIndex = event.detail.index === undefined ? event.currentTarget.dataset.index : event.detail.index
        app.globalData.photoArr = photoArr
        homeModel.addPicHot(photoArr[currentIndex].picId, 1)
        wx.navigateTo({
            url: `/pages/album/detail/detail?index=${currentIndex}&room_no=${app.globalData.roomInfo.room_no}`
        })
    },

    async subscribe() {
        const res = await subscribe.getAdvancePhotosCount();
        if (res.data) {
            wx.navigateTo({
                url: `/pages/album/subscribe/result/result?mobile_no=` + res.data.mobileNo,
            })
        } else {
            wx.navigateTo({
                url: `/pages/album/subscribe/present/present`,
            })
        }
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
     * 开始拼图(只能传一张图片)
     */
    startPuzzle: function(event) {
        var maxPuzzleNum = 9
        switch (event.detail.type) {
            case '1': maxPuzzleNum = 14
                break;
            case '0': maxPuzzleNum = 9
                break;
            case '2': maxPuzzleNum = 1
                break;
            default:
                break;
        }
        this.setData({
            toolStatus: false,
            puzzling: true,
            maxPuzzleNum
        })
    },

    showTool: function() {
        this.setData({
            toolStatus: true,
            puzzling: false
        })
    },

    toPriseRank() {
        wx.redirectTo({
            url: `/pages/album/rank/rank?room_no=${app.globalData.roomInfo.room_no}&curGroupName=${this.data.curGroupName}`
        })
    },

    /**
     * 刷新 --> 重新拉取数据
     */
    async reflesh() {
        this.data.page = 1, this.data.pageNo = 1, this.data.preloadPage = 2
        this.setData({
            puzzling: false,
            showWaterFall: false,
            currentTotal: 0
        })
        photoArr = []
        await this._loadPhotoData()
        this._loadDatePhotoArr()
        this.setData({
            showWaterFall: true
        })
        this._loadPhotos()
    },

    toSetting() {
        wx.navigateTo({
            url: `/pages/album/setting/setting?isAuthor=${this.data.isAuthor ? 1 : 0}`,
        })
    },

    /***************上传部分****************/
    uploadButtonClick(){
        switch (this.data.uploadBtn) {
            case false:
                if (app.globalData.uploadArr.length > 0 && !app.globalData.uploadCompleted) {
                    wx.showToast({
                        title: '提交的图片还在上传中，请稍后再试',
                        icon: 'none'
                    })
                    return
                }
                if(this.data.groupArr.length > 1){
                    this.setData({ 
                        groupSelector: true,
                        uploadSelectGroupName: this.data.curGroupName
                    })
                }else{
                    this.data.uploadSelectGroupName = this.data.curGroupName
                    this.toUpload()
                }
                break;
            case 2:
                app.globalData.uploadArr = []
                this.openPackage()
                break;
            case 4:
                this.toUploadResult()
                break;
            default:
                break;
        }
    },
    toUpload() {
        this.setData({ groupSelector: false })
        app.globalData.currentGroupName = this.data.uploadSelectGroupName   //保存当前分组，避免退出页面后丢失
        wx.navigateTo({
            url: `/pages/album/upload/upload?groupName=${this.data.uploadSelectGroupName}`,
        })
    },
    selectGroupForUpload(e){
        this.setData({
            uploadSelectGroupName: e.currentTarget.dataset.name
        })
    },
    cancleUpload(){
        this.setData({
            groupSelector: false
        })
    },
    toUploadResult() {
        this.setData({
            uploadBtn: false,
            uploadTotal: 0,
            uploadAlready: 0
        })
        wx.navigateTo({
            url: '/pages/album/upload/result/result',
        })
    },
    clearUploadResult(){
        app.globalData.uploadArr = []
        this.setData({
            uploadBtn: false
        })
    },
    async openPackage(){
        if(this.data.activityInfo.activityStyle == 11 && this.data.isAuthor){
            var coupon = await homeModel.getConpon('RRB94092RB9')
            if(coupon.code == 200){
                this.setData({
                    showVoucher1: true,
                    uploadBtn: false
                })
            }else{
                this.setData({
                    uploadBtn: false
                })
            }
            return
        }
        switch (this.data.showVouchers) {
            case false:
                wx.showLoading()
                var res = await uploadModel.modifyRedPacket()
                wx.hideLoading()
                this.setData({
                    voucherValue: Number(res.result).toFixed(2),
                    showVouchers: 2
                })
                break;
            default:
                this.setData({
                    showVouchers: false,
                    uploadBtn: false
                })
                break;
        }
    },
    /**
     * 监听后台上传任务，实时更新上传按钮状态
     */
    _uploadListener(){
        this.setData({
            uploadBtn: 1
        })
        if (app.globalData.uploadArr.length > 0 && app.globalData.currentUploadRoom !== '' && app.globalData.currentUploadRoom == app.globalData.roomInfo.room_no) {
            this.setData({
                uploadBtn: 0,
                uploadTotal: app.globalData.uploadArr.length,
                uploadSelectGroupName: app.globalData.currentGroupName || ''
            })
            var isDone = app.globalData.uploadArr.reduce((accumulator, currentVal) => accumulator && currentVal.done, true)
            if (!isDone) {
                clearInterval(app.globalData.uploadTimer)
                app.globalData.uploadTimer = setInterval(() => {
                    //已完成数量
                    var uploadAlready = 0
                    app.globalData.uploadArr.forEach((item) => {
                        uploadAlready += item.done ? 1 : 0
                    })
                    this.setData({
                        uploadBtn: 1,
                        uploadAlready
                    })
                    isDone = app.globalData.uploadArr.reduce((accumulator, currentVal) => accumulator && currentVal.done, true)
                    if (isDone) {
                        //非法图片数量
                        var illegalCounter = app.globalData.uploadArr.reduce((accumulator, currentVal) => currentVal.legal ? accumulator : accumulator + 1, 0)
                        this.setData({
                            uploadBtn: illegalCounter == 0 ? 2 : 4,
                            illegalCounter
                        })
                        setTimeout(() => {
                            this.reflesh()
                        }, 2000)
                        homeModel.getSubscribeStatus(uploadAlready)
                        clearInterval(app.globalData.uploadTimer)
                    }
                }, 500)
            } else {
                //非法图片数量
                var illegalCounter = app.globalData.uploadArr.reduce((accumulator, currentVal) => currentVal.legal ? accumulator : accumulator + 1, 0)
                this.setData({
                    uploadBtn: illegalCounter == 0 ? 2 : 4,
                    illegalCounter,
                    isEmpty: false
                })
            }
        } else {
            this.setData({
                uploadBtn: false
            })
        }
    },
    /***************上传end****************/


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (!this.data.calendar) {
            this._loadPhotos();
        }
    },
    // 队列加载数据
    loadingQueue() {
        const { queueLoading } = this.data;
        queueLoading.map((item, index) => {
            // 如果 没有加载过 则加载分页数据
            if (item === 0) this.loadingPhotos(index);
        })
    },

    onPageScroll: function(e) {
        if(this.data.showTools){
            this.setData({
                showTools: false
            })
        }
        if(this.scrollTimer){
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            this.setData({
                showTools: true
            })
        }, 1500);
        if (this.data.page <= (this.data.pageNo - 1) * 3 && this.data.pageNo > 5) return 
        if (e.scrollTop > 500 * this.data.pageNo) {
            if (photoArr.length >= this.data.photoTotal) return
            this._loadPhotoData()
        }

        if (e.scrollTop <= 200 && this.data.menuStat == false) {
            this.setData({
                menuStat: true
            })
        }
        if (e.scrollTop > 200 && this.data.menuStat == true) {
            this.setData({
                menuStat: false
            })
        } 
    },
    /**
     * 返回
     */
    goback(e) {
        app.globalData.fromShare = false
        wx.switchTab({
            url: '/pages/album/checkin/checkin',
        })
    },

    hideMask() {
        this.setData({
            shareStat: false
        })
    },
    /**
     * 显示分享弹窗
     */
    showShare() {
        this.setData({
            shareStat: true
        })
    },

    cancle() {
        this.setData({
            fromCreate: false
        })
    },

    async downloadQrcode() {
        wx.showLoading()
        var qrCode = await homeModel.getRoomQrCode()
        app.globalData.activityInfo.qrcodeImg = qrCode
        var ctx = wx.createCanvasContext('qrcode', this)
        app.globalData.activityInfo.total = this.data.photoTotal
        generateCover(app.globalData.activityInfo, ctx)
        wx.hideLoading()
            // downloadImage(app.globalData.activityInfo.qrcodeImg)
    },
    /**
     * 预约摄影师
     */
    arrange() {
        if (app.globalData.unionid !== app.globalData.activityInfo.unionId) {
            wx.showToast({
                title: '只有相册创建者才能预约摄影师',
                icon: 'none'
            })
            return
        }

        wx.requestSubscribeMessage({
            tmplIds: ['h2CmOIhTaGqL0XFCkyzDV59JV_gZeRpZ5WyqPiUMPbs'],
            complete: () => {
                app.globalData.mta.Event.stat("c_mtq_dynamics_photography_orderclick",{})
                wx.navigateTo({
                    url: '/pages/album/subscribe/present/present',
                }) 
            }
        })
    },
    /**
     * 设置上传权限
     */
    // toSetPermission(){
    //     if(this.data.isAuthor){
    //         this.setData({
    //             permissionStat: true
    //         })
    //     }else{
    //         wx.showToast({
    //             title: '只有管理员才能操作',
    //             icon: 'none'
    //         });
    //     }
    // },

    // setPermission(e){
    //     settingModel.createActivityRoom({
    //         activityId: app.globalData.activityInfo.activityId,
    //         activityName: app.globalData.activityInfo.activityName,
    //         powerType: e.currentTarget.dataset.status
    //     }).then(res => {
    //         homeModel.getActivityInfo().then(() => {
    //             this.setData({
    //                 permissionStat: false
    //             })
    //         })

    //     })
    // },

    // toSetLottery(){
    //     if(!this.data.isAuthor){
    //         return wx.showToast({
    //             title: '只有房间主人才能进行此操作',
    //             icon: 'none'
    //         })
    //     }
    //     wx.navigateTo({
    //         url: '/activity/setting/record/record'
    //     })
    // },

    /**
     * 用户点击右上角分享
     */
    getLink () {
        wx.switchTab({
          url: '/pages/album/checkin/checkin',
        })
    },
    onShareAppMessage: function() {
        var roomBrowseCount = app.globalData.activityInfo.browseCount
        if (roomBrowseCount > 9999) {
            roomBrowseCount = '9999+'
        } else if (roomBrowseCount > 999) {
            roomBrowseCount = '999+'
        }
        console.log(`/pages/album/home/home?room_no=${app.globalData.roomInfo.room_no}&fromShare=1&discoverId=${app.globalData.globalStoreId}`);
        
        return {
            title: `【${app.globalData.activityInfo.activityName}】 有${this.data.photoTotal}张照片，共${roomBrowseCount}次浏览`,
            path: `/pages/album/home/home?room_no=${app.globalData.roomInfo.room_no}&fromShare=1&discoverId=${app.globalData.globalStoreId}`,
            imageUrl: app.globalData.activityInfo.publicityImg ? app.globalData.activityInfo.publicityImg : app.globalData.activityInfo.bannerImg
        }
    },
    /**
     * diy列表
     */
    showDiy() {
        if (isLogin()) {
            // wx.navigateTo({
            //     url: `/pages/album/diy/proList/proList?quantity=1`,
            // })
            app.globalData.mta.Event.stat('c_mtq_album_diy_click',{
                'count':app.globalData.unionid,
                'isactive': app.globalData.activityInfo.deployRoom.length>0 ? 'true': 'false',
                'phototype': app.globalData.activityInfo.activityType
            })
            this.setData({ showVoucher1: false })
            wx.navigateTo({
                url: `/pages/album/diy/diy`,
            })
        }
    },

    /**
     * 页面生命周期-隐藏
     */
    onUnload() {
        if (app.globalData.uploadTimer) {
            clearInterval(app.globalData.uploadTimer)
        }
        wx.setStorageSync('groupMenuStyle', this.data.showGroupList ? '1' : '0')
    },

    /**
     * 切换 瀑布流/时间轴 
     */
    switchStat() {
        this.setData({
            calendar: !this.data.calendar
        })
    },
    /**
     * 时间轴详情
     */
    toCalendar(e) {
        var currentIndex = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '../calendar/calendar?date=' + this.data.datePhotoArr[currentIndex].date
        });
    },


    /****************相册密码功能******************/
    setPassword() {
        this.data.password = ''
            //校验密码下取消，返回首页
        if (this.data.passwordSession && !this.data.isEdit) {
            wx.switchTab({
                url: '/pages/album/checkin/checkin'
            })
            return
        }

        if (app.globalData.unionid !== app.globalData.activityInfo.unionId) {
            wx.showToast({
                title: '只有相册创建者才能修改密码',
                icon: 'none'
            })
            return
        }

        //编辑状态下取消，关闭对话层
        this.setData({
            isEdit: !this.data.isEdit,
            passwordSession: !this.data.passwordSession
        })
    },
    bindKeyInput(e) {
        this.data.password = e.detail.value
    },
    async completeChange() {
        //编辑密码
        if (this.data.isEdit) {
            if (!/^[0-9a-zA-z]+$/.test(this.data.password)) {
                wx.showToast({
                    title: '亲，别调皮，只能输入数字或字母哦',
                    icon: 'none'
                })
                return
            }

            const result = await settingModel.verifyContent(this.data.password)
            if(!result){
                return wx.showToast({
                    title: '密钥中包含敏感词，请重新输入',
                    icon: 'none'
                })
            }
            await settingModel.createActivityRoom({
                activityId: app.globalData.activityInfo.activityId,
                activityName: app.globalData.activityInfo.activityName,
                password: this.data.password
            })
            await homeModel.getActivityInfo()
            wx.showToast({
                title: '修改密码成功',
                icon: 'success'
            });
            this.setPassword()
            return
        }
        //校验密码
        homeModel.verifyPassword(this.data.password).then(result => {
            if (result) {
                //插入历史记录
                homeModel.addRecord()
                    //新手指引
                if (!wx.getStorageSync('guidance-home')) {
                    this.setData({
                        guidance: 1
                    })
                    wx.setStorageSync('guidance-home', 1)
                }
                this.setData({
                    passwordSession: false
                })
            } else {
                wx.showToast({
                    title: '密码错误,请重新输入',
                    icon: 'none'
                })
            }
        })
    },
    /****************相册密码功能end******************/


    reciveCoupon() {
        //如果type为1跳转到H5活动链接        
        if(this.data.couponInfo.type == 1){
            app.globalData.activityH5Url = this.data.couponInfo.redirectUrl
            wx.navigateTo({
                url: '/pages/webview/beauty/beauty?activity_id=' + this.data.room_no,
                showCoupon: false
            })
        }else{
            this.setData({
                showCoupon: this.data.showCoupon === 1 ? 2 : false
            })
        }
    },

    /*****************冲印券*********************/
    // hideCyCoupon() {
    //     this.setData({
    //         showCyCoupon: false
    //     })
    // },

    // toCyCoupon() {
    //     this.setData({
    //         showCyCoupon: false
    //     })
    // },
    /*****************冲印券end*********************/

    toLottery(){
        this.setData({
            lotteryStat: false
        })
        wx.navigateTo({
            url: '/activity/lottery/lottery'
        })
    },

    hideLottery(){
        this.setData({
            lotteryStat: false
        })
    },

    /**
     * 新手指导  下一步
     */
    nextStep() {
        var guidance = this.data.guidance + 1
        this.setData({
            guidance: guidance == 4 ? false : guidance
        })
    },

    userInfoEvent(){
        this.setData({
            anonymous: false
        })
    },

    setPoster(){
        wx.navigateTo({
            url: '/pages/album/toast/toast'
        })
    },

    hidePoster(){
        this.setData({
            posterStat: false
        })
    },


    subscribe(e){
        var tmplIds = ['88GlJBArDKeeCjUZUPdCYb11oTqx5Bu6rSh7SW5uS14']
        if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
            tmplIds = ['88GlJBArDKeeCjUZUPdCYb11oTqx5Bu6rSh7SW5uS14']
        }
        wx.requestSubscribeMessage({
            tmplIds,
            complete: res => {
                wx.setStorageSync('subscribleRoom', '1')
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

    hideVoucher1(){
        this.setData({ showVoucher1: false })
    }

})