import { Beauty } from '../beauty-model'
var beautyModel = new Beauty()

const {  } = getApp().globalData
const deviceInfo = wx.getSystemInfoSync()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        height: 0,
        currentIndex: 0,
        status: 0,       //0->未评价  1->满意  2->不满意
        reason: [],
        entrys: [
            {
                commentText: '无力吐槽',
                selected: false
            },
            {
                commentText: '隔屏尴尬',
                selected: false
            },
            {
                commentText: 'P得过猛',
                selected: false
            },
            {
                commentText: '这照片不行',
                selected: false
            },
            {
                commentText: '修图师罢工',
                selected: false
            },
            {
                commentText: '构图渣',
                selected: false
            },
            {
                commentText: '还不如真人',
                selected: false
            },
            {
                commentText: '我选择沉默',
                selected: false
            },
            {
                commentText: '模版不OK',
                selected: false
            },
            {
                commentText: '5毛钱制作',
                selected: false
            }
        ],
        sessionStat: false,
        content: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.taskId = options.taskId
        beautyModel.getProduct(options.taskId).then(list => {
            this.setData({
                list,
                currentIndex: options.index
            })
            this.initImageInfo()
        })
        
    },

    /**
     * 左右切换
     */
    intervalChange(e){
        var currentIndex = e.detail.current
        if(currentIndex == 0){
            wx.showToast({
                title: '已经是最前一张了',
                icon: 'none'
            })
            return
        }
        if (currentIndex >= this.data.list.length - 1 ) {
            wx.showToast({
                title: '已经是最后一张了',
                icon: 'none'
            })
            return
        }
        this.setData({
            currentIndex
        })
        this.initImageInfo()
    },

    /**
     * 初始化图片信息  宽/高等
     */
    initImageInfo(){
        var img = this.data.list[this.data.currentIndex], status = 0
        switch (img.evaluate) {
            case beautyModel.statusEnum.SATISFACTION:
                status = 1
                break;
            case beautyModel.statusEnum.UNSATISFACTION:
                status = 2
                break;
            default:
                break;
        }
        this.setData({
            status,
            reason: Boolean(img.comment) && img.evaluate == 2 ? img.comment.split(',') : [],
            content: ''
        })
        beautyModel.getImageSize(img.imageUrl).then(res => {
            this.setData({
                height: Math.floor(deviceInfo.windowWidth / res.width * res.height) + 'px'
            })
        })
    },

    /**
     * 评论
     */
    comment(e){
        var img = this.data.list[this.data.currentIndex]
        if(img.evaluate == beautyModel.statusEnum.PENDING){
            beautyModel.collectFormId(e.detail.formId)
            //点击不满意 弹出选择理由
            if(e.detail.target.dataset.status == 2){
                var entrys = this.data.entrys
                for (let index = 0; index < entrys.length; index++) {
                    entrys[index].selected = false
                }
                this.setData({
                    sessionStat: true,
                    entrys
                })
            }else{
                beautyModel.saveEvaluate(img.fileId, beautyModel.statusEnum.SATISFACTION, this.data.taskId).then(res => {
                    wx.showToast({ 
                        icon: 'none',
                        duration: 3000,
                        title: `谢谢您的评价 \r\n 提示：您还有${res}张没有评论` 
                    })
                    img.evaluate = beautyModel.statusEnum.SATISFACTION
                    this.setData({
                        ['list['+ this.data.currentIndex +']']: img,
                        status: 1
                    })
                }).catch(err => {
                    wx.showToast({
                        title: '您没有评论权限',
                        icon: 'none'
                    })
                })
            }
        }
    },
    /**
     * 提交
     */
    submitComment(){
        var img = this.data.list[this.data.currentIndex], 
        selectArr = this.data.entrys.filter(item => (item.selected)),
        reason = []
        selectArr.forEach(item => {
            reason.push(item.commentText)
        })
        reason.push(this.data.content)
        reason = reason.join(',')
        beautyModel.saveEvaluate(img.fileId, beautyModel.statusEnum.UNSATISFACTION, this.data.taskId, reason).then(res => {
            wx.showToast({ 
                icon: 'none',
                duration: 3000,
                title: `谢谢您的评价 \r\n 提示：您还有${res}张没有评论` 
            })
            img.evaluate = beautyModel.statusEnum.UNSATISFACTION
            img.comment = reason
            this.setData({
                ['list['+ this.data.currentIndex +']']: img,
                status: 2,
                sessionStat: false,
                reason: reason.split(',')
            })
        }).catch(err => {
            wx.showToast({
                title: '您没有评论权限',
                icon: 'none'
            })
        })
        
    },

    inputEventHandle(e){
        this.setData({
            content: e.detail.value
        })
    },

    selectTag(e){
        this.setData({
            ['entrys['+ e.currentTarget.dataset.index +'].selected'] : !this.data.entrys[e.currentTarget.dataset.index].selected
        })
    },

    switchSession(){
        this.setData({
            sessionStat: false
        })
    },

    stop(){
        return false
    }
})