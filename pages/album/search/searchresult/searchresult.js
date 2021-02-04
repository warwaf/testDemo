// pages/album/search/searchresult/searchresult.js
import { Searchresult } from './searchresult-model.js'
const searchresultModel = new Searchresult()
var app = getApp()
var photoArr = []
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mineImg: 'https://hcmtq.oss-accelerate.aliyuncs.com/resources/search_wrm.png',
        //tab栏
        photoTotal: 0,
        currentTotal: 0,
        //瀑布流相关
        photo: {},
        page: 1,
        size: 10,
        preloadPage: 1,
        finished: false,
        isLoading: false,
        scrollTop: 0,
        puzzling: false,
        deleting: false,
        maxPuzzleNum: 9,
        //放大组件相关
        showDetail: false,
        bigImgArr: [],
        currentIndex: 0,
        //tool
        btnStatus: {},
        toolStatus: true,
        //集福
        fuStatus: false,
        activityId: 0,
        faceId: '',
        groupFaceId: '',
        canvas_width: 136,
        canvas_height: 136,
        change: false,
        firstImg: [],
        imgList: {
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            picUrl: ''
        },
        isLoading: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            activityId: app.globalData.roomInfo.room_no,
            groupFaceId: app.globalData.searchInfo.groupFaceId,
            persistedFaceId: app.globalData.searchInfo.persistedFaceId,
            imgList: app.globalData.searchInfo,
            isLoading: true
        })

        if (options.from == 'mine') {
            this.setData({
                change: true
            })
        }
        this.loadImg()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //this.loadImg()
    },
    /**
     * 瀑布流加载图片
     */
    loadImg: function() {
        //获取图片列表
        searchresultModel.listImageByGroupFaceId(this.data.activityId, this.data.persistedFaceId).then(res => {
            photoArr = res.result
            console.info(res)
            this.setData({
                num: res.result.length,
                isLoading: false
            })
            var columnWidth = Math.floor(wx.getSystemInfoSync().windowWidth / 3)
            for (let i = 0; i < photoArr.length; i++) {
                if (photoArr[i]) {
                    photoArr[i].check = false
                    photoArr[i].height = Math.floor(photoArr[i].picHeight / (photoArr[i].picWidth / columnWidth))
                    photoArr[i].index = i
                    this.setData({
                        photo: photoArr[i]
                    })
                }
            }
        })
    },
    /**
     * 更换
     */
    changeImg() {
        wx.redirectTo({
            url: `/pages/album/search/searchmine/searchmine?activityId=${this.data.activityId}`,
        })
    },
    /**
     * 跳转到详情页
     */
    showDetail: function(event) {
        var currentIndex = event.detail.index
        app.globalData.photoArr = photoArr
        wx.navigateTo({
            url: `/pages/album/detail/detail?index=${currentIndex}&room_no=${app.globalData.roomInfo.room_no}`
        })
    },

    toDiy(){
        app.globalData.diyData = photoArr
        wx.navigateTo({
            url: '/pages/album/diy/diy'
        })
    }
})