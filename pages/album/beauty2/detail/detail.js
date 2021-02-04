import filmModel from '../film/film-model'
import {
    Home
} from '../../home/home-model'
import {
    downloadImage
} from '../../../../utils/util'
var deviceInfo = wx.getSystemInfoSync()
var homeModel = new Home()

var app = getApp()
var range = {
    max: 40,
    min: 40
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: [],
        height: '100vh',
        currentIndex: 0,
        fromShare: false,
        isFilm: false,
        isRecycle: false,
        enable: false,
        storeName: '',
        roomInfo: {},
        toastIcon: "",
        toastMsg: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({
            typeId: options.typeId ? options.typeId : ""
        })
        var res = await filmModel.getStoreByActivityId(options.room_no)
        if (options.fromShare == 1) {
            let _roomInfoRes = await await homeModel.getActivityInfo(options.room_no)
            console.log(">>>>>", _roomInfoRes)
            this.setData({
                roomInfo: {
                    ..._roomInfoRes
                }
            })
            app.globalData.roomInfo.room_no = _roomInfoRes.activityId
            app.globalData.activityInfo.activityName = _roomInfoRes.activityName
        }
        if (res.result) {
            app.globalData.discoverInfo = res.result
            this.setData({
                storeName: res.result.name
            })
        }
        if (options.url) {
            this.setData({
                data: [{
                    picUrl: options.originUrl ? options.originUrl : options.url,
                    finePic: options.url
                }],
                fromShare: true
            })
        } else {
            var currentIndex = options.index
            this.setData({
                data: app.globalData.photoArr,
                currentIndex,
                fromShare: options.fromShare == '1'
            })
            //导航栏标题
            wx.setNavigationBarTitle({
                title: `${app.globalData.activityInfo.activityName}`
            })
        }
        this.setData({
            isFilm: Boolean(options.film),
            isRecycle: Boolean(options.recycle)
        })
        this.initImage()
        var res = await filmModel.checkComfirmStatus()
        this.setData({
            enable: res.code != 500
        })

        range = await filmModel.getRange()
        // console.log("this.data.data", this.data.data)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    initImage() {
        var pic = this.data.data[this.data.currentIndex]
        //动态获取图片高度，动态设置轮播图高度
        wx.getImageInfo({
            src: pic.picUrl.replace('http://', 'https://') + '?x-oss-process=image/resize,w_50',
            success: res => {
                var height = Math.floor(res.height / (res.width / deviceInfo.windowWidth)) + 'px'
                this.setData({
                    height
                })
            }
        })
    },

    intervalChange(e) {
        var currentIndex = e.detail.current
        this.setData({
            currentIndex
        })
        this.initImage()
    },

    async inRecycle() {
        wx.showLoading()
        if (this.data.enable) {
            wx.hideLoading()
            return wx.showToast({
                title: '您已确认完成汰片，不可将设计片移出回收站',
                icon: 'none'
            })
        }
        if (this.data.data.length < range.min) {
            wx.hideLoading()
            return wx.showToast({
                title: '添加失败，制作相册照片数不能少于10张',
                icon: 'none'
            })
        }
        await filmModel.getUnionid()
        var res = await filmModel.inRecycle(this.data.data[this.data.currentIndex].picId, 'delete')
        wx.hideLoading()
        if (res.code == 500) {
            return wx.showToast({
                title: res.message,
                icon: 'none'
            })
        } else {
            wx.showToast({
                title: '操作成功',
                icon: 'none'
            })
        }
        var data = this.data.data
        data.splice(this.data.currentIndex, 1)
        this.setData({
            data,
            currentIndex: this.data.currentIndex - 1 < 0 ? 0 : this.data.currentIndex - 1
        })
    },

    async outRecycle() {
        if (this.data.enable) {
            return wx.showToast({
                title: '您已确认完成汰片，不可将设计片移出回收站',
                icon: 'none'
            })
        }
        var list = await filmModel.getFilms(1)
        await filmModel.getUnionid()
        var res = await filmModel.inRecycle(this.data.data[this.data.currentIndex].picId, 'add')
        if (res.code == 500) {
            return wx.showToast({
                title: res.message,
                icon: 'none'
            })
        } else {
            wx.showToast({
                title: '操作成功',
                icon: 'none'
            })
        }
        var data = this.data.data
        data.splice(this.data.currentIndex, 1)
        this.setData({
            data,
            currentIndex: this.data.currentIndex - 1 < 0 ? 0 : this.data.currentIndex - 1
        })
    },

    async complete() {
        if (this.data.data.length > range.max || this.data.data.length < range.min) {
            return wx.showToast({
                title: `添加失败，制作相册照片数不能多于${range.max}张且不能少于${range.min}张`,
                icon: 'none'
            })
        }
        await filmModel.getUnionid()
        var res = await filmModel.comfirmPick()
        if (res.code == 200) {
            wx.showToast({
                title: '操作成功',
                icon: 'none'
            })
        } else {
            return wx.showToast({
                title: res.message,
                icon: 'none'
            })
        }
        this.setData({
            enable: true
        })

    },

    async goShop() {
        wx.navigateTo({
            url: `/pages/discovery/store/store?special=1&style=${app.globalData.discoverInfo.style}`,
        })
        // wx.switchTab({
        //     url: '/pages/discovery/index/index'
        // })
    },
    /**
     * 大图预览
     * 支付权限开启 且 已全款支付 - 软房间
     * @param {Object} e 目标对象
     * @param {String} isDownload 支付权限 0：不可下载  1：可下载
     * @param {String} payState 订单状态 Paid：全款支付
     */
    showBig(e) {        
        console.log(JSON.parse(JSON.stringify(app.globalData.roomInfo)), JSON.parse(JSON.stringify(this.data.roomInfo)))
        let payState = this.data.roomInfo.payState || app.globalData.roomInfo.payState 
        if (!((this.data.roomInfo.isDownload == 1 || app.globalData.roomInfo.isDownload == 1) && payState == "Paid") && this.data.typeId == 11) {
            this.setData({
                toastIcon: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/error.png",
                toastMsg: "完成付款后支持查看完整图片"
            })
            this.selectComponent('#customToast').show();
            return
        }
        let { item } = e.currentTarget.dataset
        wx.previewImage({
            urls: [item.picUrl],
        })
    },
    /**
     * 下载功能
     * 支付权限开启 且 已全款支付 - 软房间
     * @param {String} isDownload 支付权限 0：不可下载  1：可下载
     * @param {String} payState 订单状态 Paid：全款支付
     */
    download() {
        console.log(JSON.parse(JSON.stringify(app.globalData.roomInfo)), JSON.parse(JSON.stringify(this.data.roomInfo)))
        let payState = this.data.roomInfo.payState || app.globalData.roomInfo.payState 
        if (!((this.data.roomInfo.isDownload == 1 || app.globalData.roomInfo.isDownload == 1) && payState == "Paid") && this.data.typeId == 11) {
            this.setData({
                toastIcon: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/1.10.2/error.png",
                toastMsg: "请付款或向门店人员申请下载权限"
            })
            this.selectComponent('#customToast').show();
            return
        }
        var pic = this.data.data[this.data.currentIndex]
        downloadImage(pic.picUrl.replace('http://', 'https://'))
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let sharePath = '',
            imgUrl = "",
            originUrl = this.data.data[this.data.currentIndex].picUrl
        if (this.data.isFilm || this.data.typeId == 11) {
            imgUrl = this.data.data[this.data.currentIndex].thumbnailUrl2
            sharePath = `/pages/album/beauty2/detail/detail?url=${imgUrl}&room_no=${app.globalData.roomInfo.room_no || this.data.roomInfo.activityId}&typeId=${this.data.typeId}&fromShare=1&originUrl=${originUrl}`
        } else {
            imgUrl = this.data.data[this.data.currentIndex].finePic
            sharePath = `/pages/album/beauty2/detail/detail?url=${imgUrl}&room_no=${app.globalData.roomInfo.room_no || this.data.roomInfo.activityId}&typeId=${this.data.typeId}&fromShare=1&originUrl=${originUrl}`
        }
        return {
            title: `${app.globalData.activityInfo.activityName || this.data.roomInfo.activityName}`,
            path: sharePath,
            imageUrl: imgUrl
        }
    },
})