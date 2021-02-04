import { safeBtoa } from '../../../../utils/util.js'
import { Beauty } from '../beauty-model.js'

var beautyModel = new Beauty()
var deviceInfo = wx.getSystemInfoSync()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: [],
        height: '100vh',
        currentIndex: 0,
        praiseArr: [],
        waterMark: safeBtoa(app.globalData.waterMark + '?x-oss-process=image/resize,P_16'),
        praised: false,
        showFine: false,
        imgSrc: '',
        sessionStat: false,
        total: 0,
        comment: [],
        tags: [],
        selected: true,
        commentError: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var currentIndex = options.index
        var showFine = app.globalData.photoArr[currentIndex].type == beautyModel.PicType.Beauty
        beautyModel.getDefaultTags().then(res => { 
            var tags = res.map(item => ({commentText: item.theValue, selected: false}))
            this.setData({
                tags
            })            
        })
        this.setData({
            data: app.globalData.photoArr,
            currentIndex,
            showFine,
            imgSrc: showFine ? app.globalData.photoArr[currentIndex].finePic : app.globalData.photoArr[currentIndex].originPic
        })
        wx.hideShareMenu();
        this.initImage()
    },

    initImage(){
        var pic = this.data.data[this.data.currentIndex]
        this.setData({
            selected: pic.pickState
        })
        //动态获取图片高度，动态设置轮播图高度
        wx.getImageInfo({
            src: pic.originPic.replace('http://', 'https://') + '?x-oss-process=image/resize,w_50',
            success: res=> {
                var height = Math.floor(res.height / (res.width / deviceInfo.windowWidth)) + 'px'
                this.setData({
                    height
                })
            }
        })
        beautyModel.getPraise(pic.picId).then(res => {
            var praised = res.result.some(ele => ele.unionId == app.globalData.userInfo.unionId)
            this.setData({
                praiseArr: res.result,
                praised
            })
        })
        
        //根据图片类型获取吐槽信息
        beautyModel.getComment(pic.picId, this.data.showFine ? 1 : 0).then(res => {
            this.setData({
                comment: res.detail,
                total: res.total
            })
        })
    },

    intervalChange(e){
        var currentIndex = e.detail.current
        var currentElement = app.globalData.photoArr[currentIndex]
        var isFine = currentElement.type == beautyModel.PicType.Beauty

        this.setData({
            currentIndex,
            showFine: isFine,
            imgSrc: isFine ? currentElement.finePic : currentElement.originPic
        })
        this.initImage()
    },
    /**
     * 点赞
     */
    praise(){
        var curPic = this.data.data[this.data.currentIndex]
        beautyModel.updatePrise(curPic.picId, curPic.picUrl).then(res => {
            if(res.code == 500){
                wx.showToast({
                    title: '您已点赞',
                    icon: 'none'
                })
                return
            }
            beautyModel.getPraise(curPic.picId).then(res => {
                var pages = getCurrentPages();
                pages[pages.length - 2].praise(curPic.picId, res.result.length)
                this.setData({
                    praiseArr: res.result,
                    praised: true
                })
            })
        })
        app.globalData.mta.Event.stat("c_mtq_photoablum_pic_like",{})
    },

    toSelect(){
        var curPic = this.data.data[this.data.currentIndex]
        beautyModel.pickProduct(curPic.jobId, curPic.fileId, curPic.pickState ? 'del' : 'add').then(() => {
            this.setData({
                ['data[' +this.data.currentIndex+ '].pickState']: !curPic.pickState,
                selected: !this.data.selected
            })
        }).catch(err => {
            wx.showToast({
                title: '您不具备权限进行操作',
                icon: 'none'
            })
        })
    },

    magnify(){
        if(this.data.showFine){
            wx.previewImage({
                urls: [this.data.data[this.data.currentIndex].finePic + '?x-oss-process=image/resize,l_1600'],
            })
        } else {
            wx.previewImage({
                urls: [this.data.data[this.data.currentIndex].originPic + '?x-oss-process=image/resize,l_1600'],
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
    /**
     * 切换精修 / 原图
     */
    switchType(e){
        var type = e.currentTarget.dataset.type
        if(type == 1){
            this.setData({
                imgSrc: app.globalData.photoArr[this.data.currentIndex].finePic,
                showFine: true
            })
        } else {
            this.setData({
                imgSrc: app.globalData.photoArr[this.data.currentIndex].originPic,
                showFine: false
            })       
        }
        beautyModel.getComment(app.globalData.photoArr[this.data.currentIndex].picId, type).then(res => {
            this.setData({
                comment: res.detail,
                total: res.total
            })
        })
    },

    async submitComment(){
        wx.showLoading()
        app.globalData.mta.Event.stat("c_mtq_photoablum_pic_comment",{})
        var curPic = this.data.data[this.data.currentIndex]
        var tags = this.data.tags.filter(tag => tag.selected)
        if(!tags.length && !this.data.content){
            wx.showToast({
                title: '内容不能为空',
                icon: 'none',
                mask: true
            })
            return 
        }
        var content = []
        tags.forEach(item => content.push({
            commentText: item.commentText,
            picId: curPic.picId,
            type: this.data.showFine ? 1 : 0
        }))
        if(this.data.content){
            beautyModel.verifyContent(this.data.content).then(verifyResult => {
                if(!verifyResult){
                    wx.hideLoading()
                    return this.setData({
                        commentError: true
                    })
                }else{
                    content.push({
                        picId: curPic.picId,
                        type: this.data.showFine ? 1 : 0,
                        commentText: this.data.content
                    })
                    wx.hideLoading()
                    beautyModel.saveComment(content).then(_ => {
                        beautyModel.getComment(curPic.picId, this.data.showFine ? 1 : 0).then(res => {
                            this.setData({
                                comment: res.detail,
                                total: res.total,
                                sessionStat: false
                            })
                        })
                    })
                }
            })
        }
    },

    cancle(){
        this.setData({
            commentError: false
        })
    },
    /**
     * 点击tag
     */
    selectTag(e){
        this.setData({
            ['tags['+e.currentTarget.dataset.index+'].selected']: !this.data.tags[e.currentTarget.dataset.index].selected
        })
    },

    /**
     * 打开/关闭对话层
     */
    switchSession(){
        var tags = this.data.tags
        tags.forEach((item, index) => tags[index].selected = false)
        //滑动页面到底部，解决键盘无法顶起输入框的BUG
        wx.pageScrollTo({
            scrollTop: 10000,
            duration: 0,
            success: () => {
                this.setData({
                    tags,
                    content: '',
                    sessionStat : !this.data.sessionStat
                })
            }
        })
    },

    inputEventHandle(e){
        this.data.content = e.detail.value
    },

    nothing(){
        return false
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})