import { Setting } from './setting-model.js'
import { Home } from '../home/home-model.js'

var settingModel = new Setting()
var homeModel = new Home()

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomInfo: {
            activityId: '',
            activityName: '',
            bannerImg: '',
            password: null,
            powerType: true
        },
        titleStat: false,
        bannerStat: false,
        activity_name: '',
        bannerList: [],
        error:false,
        cropperStat: false,
        fromBeauty: false,
        cropperOptions: {
            hidden: true,
            src: '',
            mode: '',
            sizeType: []
        },
        members: [],
        total: 0,
        passwordStat: false,
        passwordSession: false,
        password: '',
        isLoading: false,
        isAuthor: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.data.fromBeauty = options.fromBeauty
        this.setData({
            'roomInfo.id': app.globalData.activityInfo.id,
            'roomInfo.activityId': app.globalData.activityInfo.activityId,
            'roomInfo.activityName': app.globalData.activityInfo.activityName,
            'roomInfo.bannerImg': app.globalData.activityInfo.bannerImg,
            'roomInfo.password': app.globalData.activityInfo.password,
            'roomInfo.powerType': app.globalData.activityInfo.powerType,
            'roomInfo.activityStyle': app.globalData.activityInfo.activityStyle,
            isAuthor: options.isAuthor == 1,
            passwordStat: Boolean(app.globalData.activityInfo.password)
        })
        settingModel.getBannerList(app.globalData.activityInfo.activityType).then(res => {
            this.setData({
                bannerList: res
            })
        })
    },

    onShow: function(){
        settingModel.getMembers(1, 20).then(res => {
            var members = []
            if(this.data.isAuthor == 1){
                members = res.result.list.slice(0,15)
            }else{
                members = res.result.list.slice(0,16)
            }
            this.setData({
                members,
                total: res.result.total
            })
        })
    },

    showTitle(){
        this.setData({
            titleStat: 1
        })
    },

    toChangeBanner() {
        this.setData({
            bannerStat: true
        })
    },

    bindKeyInput(e){
        this.setData({
            activity_name: e.detail.value
        })
    },
    //启用密码
    enablePassword(e){
        if(!e.detail.value){
            this.setData({
                passwordStat: false,
                'roomInfo.password': ''
            })
            settingModel.updateActivityRoom(this.data.roomInfo)
            return
        }
        this.setData({
            passwordStat: true,
            passwordSession: true
        })
    },
    closePasswordSession(){
        if(!this.data.roomInfo.password){
            this.setData({
                passwordStat: false
            })
        }
        this.setData({
            passwordSession: false,
            password: ''
        })

    },
    showPassword(){
        if(this.data.passwordStat){
            this.setData({
                passwordSession: true
            })
        }
    },
    completeChange(){
        if(this.data.password.length == 0){
            wx.showToast({
                title: '亲，至少要输入一位哦',
                icon: 'none'
            })
            return
        }
        if(!/^[0-9a-zA-z]+$/.test(this.data.password)){
            wx.showToast({
                title: '亲，别调皮，只能输入数字或字母哦',
                icon: 'none'
            })
            return
        }
        this.setData({
            'roomInfo.password': this.data.password,
            passwordSession: false
        })
        settingModel.updateActivityRoom(this.data.roomInfo)
    },

    bindPasswordInput(e){
        this.data.password = e.detail.value
    },

    changeTitle(){
        if (0 == this.data.activity_name.length || this.data.activity_name.length > 15){
            wx.showToast({
                title: '标题名称长度不得为空或者大于15个字符',
                icon: 'none'
            })
            return
        }
        settingModel.verifyContent(this.data.activity_name).then(res => {
            if(res){
                this.setData({
                    'roomInfo.activityName': this.data.activity_name,
                    titleStat: 3
                })
            }else{
                this.setData({
                    activity_name: this.data.roomInfo.activityName,
                    titleStat: 2
                })
            }
            settingModel.updateActivityRoom(this.data.roomInfo)
        })

    },

    /**
     * 重新编辑
     */
    reFill(){
        this.setData({
            titleStat: 1,
            activityName: ''
        })
    },

    cancleTitle(){
        this.setData({
            titleStat: false,
            activity_name: this.data.roomInfo.activityName,
        })
    },

    complete(){
        this.setData({
            titleStat: false
        })
    },

    changeBanner(e){
        var curIndex = e.currentTarget.dataset.index
        this.setData({
            'roomInfo.bannerImg': this.data.bannerList[curIndex],
            bannerStat: false
        })
        settingModel.updateActivityRoom(this.data.roomInfo)
    },

    cropCompleteEvent(url){
        this.setData({
            'roomInfo.bannerImg': url,
            bannerStat: false
        })
        settingModel.updateActivityRoom(this.data.roomInfo)
    },

    /**
     * 提交
     */
    submit(){
        if (this.data.fromBeauty == 1){
            wx.redirectTo({
                url: '/pages/album/beauty/home?room_no=' + app.globalData.activityInfo.activityId,
            })
        }else if(this.data.fromBeauty == 2){
            wx.redirectTo({
                url: '/pages/album/beauty2/beauty2?room_no=' + app.globalData.activityInfo.activityId,
            })
        }else if(this.data.fromBeauty == 3){
            wx.redirectTo({
                url: '/pages/album/newBeauty/newBeauty?room_no=' + app.globalData.roomInfo.room_no + '&typeId=' + app.globalData.roomInfo.typeId,
            })
        }else {
            wx.redirectTo({
                url: '/pages/album/home/home?room_no=' + app.globalData.activityInfo.activityId,
            })
        } 
    },

    /**
     * 跳转到他的个人首页
     */
    toPersonal(e){
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + e.currentTarget.dataset.id
        })
    },

    setWatermark(){
        wx.navigateTo({
            url: './watermark/watermark'
        })
    },

    setGroup(){
        if(app.globalData.uploadArr.length > 0){
            return wx.showToast({
                title: '图片上传中，不能修改分组',
                icon: 'none'
            })
        }
        wx.navigateTo({
            url: './group/group'
        }) 
    },

    stop(){
        return
    },
    /**
    * 返回
    */
    goback(e) {
        if (e.detail == 'goto') {
            wx.navigateTo({
                url: '/pages/album/create/create',
            })
        }
    },
    /**
     * 取消
    */
    cancle() {
        this.setData({
            error: false,
            success: false
        })
    },
    /**
     * 选择相册图片
     */
    async selectImageFromAlbum(){
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })
        const res = await app.chooseImage(1, {sizeType:['compressed']})
        wx.showLoading()
        let path = res.tempFiles[0].path
        try {
            await app.checkLocalImage(path)
        } catch (error) {
            wx.hideLoading()
            return wx.showToast({
                title: '图片不合格，请重新上传',
                icon: 'none'
            })
        }
        wx.hideLoading()
        this.setData({
            bannerStat: false
        })
        wx.navigateTo({
            url: `/components/common/cropper/cropper?src=${path}&ratio=1.88`
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

    showMore(){
        wx.navigateTo({
            url: `./members/members?isAuthor=${this.data.isAuthor ? 1 : 0}`
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
                            homeModel.getRoomPhotos(null, 1).then(res => {
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
    /**
     * 修改上传权限
     */
    changeUploadPermission(){
        this.data.roomInfo.powerType = this.data.roomInfo.powerType ? 0 : 1
        settingModel.updateActivityRoom(this.data.roomInfo)
    },
    /**
     * 跳转到踢出成员页
     */
    toRemove(){
        wx.navigateTo({
            url: './remove/remove'
        })
    },

    toActivity(){
        wx.navigateTo({
            url: '/activity/setting/record/record'
        })
    },

    toPoster(){
        wx.navigateTo({
            url: '/pages/album/toast/toast'
        })
    }
})