import regeneratorRuntime from '../../../../utils/runtime.js'
import { Rank } from '../../rank/rank-model'
import { Diy } from '../diy-model'

var rankModel = new Rank()
var diyModel = new Diy()

var app = getApp()
var columnWidth = Math.floor((wx.getSystemInfoSync().windowWidth - 30) * 0.33)

var photoArr = []
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //该房间下该用户是否存在faceId
        isRegister: true,
        //关于我的
        myPhotos: null,
        //我上传的
        myUpload: [],
        //我收藏的
        myCollection: [],
        //全部图片
        allPhotos: [],
        //人脸识别数据
        recognizeData: [],
        photoToal: 0,
        pageNo: 1,
        pageSize: 30,
        //购物车
        cartStat: false,
        selectArr: [],
        maxPuzzleNum: 1,
        minPuzzleNum: 1,
        remainPcs: 0,
        showAll: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            maxPuzzleNum: options.max,
            minPuzzleNum: options.min,
            recognizeData: app.globalData.diyData
        })

        this.setData({
            remainPcs: options.max
        })
        rankModel.getRank2(this.data.pageNo, this.data.pageSize).then(res => {
            photoArr = photoArr.concat(res.result.list)
            this.setData({
                allPhotos: res.result.list,
                pageNo: this.data.pageNo + 1,
                photoToal: res.result.total
            })
        })

        diyModel.getUploadImage().then(res => {
            var arr = []
            res.result.forEach((item, index) => {
                arr = arr.concat(item.imageDetails)
            })
            this.setData({
                myUpload: arr
            })
        })

        diyModel.getCollectionList().then(res => {
            this.setData({
                myCollection: res.result
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function() {
        //该用户在改房间是否有自己的faceId,每次显示页面查询
        var faceId = await diyModel.getSelfFaceId()
        //关于我的
        if(faceId.groupFaceId){
            wx.setNavigationBarColor({
                backgroundColor: '#ffffff',
                frontColor: '#000000'
            })
            //销毁 “关于我” waterfall组件，重新渲染
            this.setData({
                myPhotos: null,
                isRegister: true
            })
            var myPhotos = await diyModel.getSelfImage(faceId.groupFaceId)
            this.setData({
                myPhotos
            })
        } else {
            this.setData({
                isRegister: false
            })
            wx.setNavigationBarColor({
                backgroundColor: '#FFE227',
                frontColor: '#000000'
            })
        }
    },

    /**
     * 选择图片
     */
    selectImg(event) {        
        var currentImg = event.detail.currentImg, selectArr = this.data.selectArr.slice(0), imgIndex = false
        selectArr.map((currentVal, index) => {
            if(currentVal.picId == currentImg.picId){
                imgIndex = index
            }
        })
        if(!event.detail.type && imgIndex !== false){
            selectArr.splice(imgIndex, 1)
            this.setData({
                selectArr,
                remainPcs: this.data.remainPcs + 1
            })
        } else{
            this.setData({
                selectArr: selectArr.concat(currentImg),
                remainPcs: this.data.remainPcs - 1
            })
        }
    },

    /**
     * 点击下一步
     */
    next() {
        if (this.data.selectArr.length > this.data.maxPuzzleNum) {
            wx.showToast({
                title: `最多选择${this.data.maxPuzzleNum}张照片`,
                icon: 'none'
            })
            return
        }
        if (this.data.selectArr.length < this.data.minPuzzleNum) {
            wx.showToast({
                title: `至少选择${this.data.minPuzzleNum}张照片`,
                icon: 'none'
            })
            return
        }
        var selectPhotos = []
        this.data.selectArr.forEach(item => {
            selectPhotos.push(item.picUrl)
        })
        app.globalData.selectPhotos = selectPhotos
        
        wx.redirectTo({
            url: '../produce/produce'
        })
    },

    findMe() {
        this.setData({
            myPhotos: []
        })
        wx.navigateTo({
            url: `/pages/album/search/searchmine/searchmine?activityId=${app.globalData.activityInfo.activityId}`
        })
    },

    /**
     * 选择全部
     */
    checkAll(){
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
        this.setData({
            showAll: !this.data.showAll
        })
    },

    /**
     * 展示/隐藏 购物车
     */
    showCart(){
        this.setData({
            cartStat: !this.data.cartStat
        })
    },

    /**
     * 从购物车移除图片
     */
    remove(e){
        var selectArr = this.data.selectArr.slice(0)
        var waterfalls = this.selectAllComponents(".waterfall")
        waterfalls.map(item => {
            item.removeImage(selectArr[e.currentTarget.dataset.index])
        })
        selectArr.splice(e.currentTarget.dataset.index, 1)
        this.setData({
            selectArr
        })
    },

    nothing(){return},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if(this.data.showAll){
            rankModel.getRank2(this.data.pageNo, this.data.pageSize).then(res => {
                photoArr = photoArr.concat(res.result.list)
                this.setData({
                    allPhotos: res.result.list,
                    pageNo: this.data.pageNo + 1
                })
            })
        }
    },
})