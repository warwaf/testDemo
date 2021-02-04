import { Home } from '../home/home-model'
var homeModel = new Home()

var app = getApp()

var photoArr = []

Page({

    /**
     * 页面的初始数据
     */
    data: {
        photo: {},
        page: 1,
        size: 30,
        isLoading: true,
        currentTotal: 0,
        date: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.date = options.date
        //导航栏标题
        wx.setNavigationBarTitle({
            title: options.date
        })
        photoArr = []
        this._loadPhotos()
    },

    _loadPhotos(){
        homeModel.getPhotosByDate(this.data.date, this.data.page, this.data.size).then(res => {
            photoArr.push(...res)
            this.setData({
                photo: res,
                currentTotal: this.data.currentTotal + res.length,
                isLoading: false,
                page: this.data.page + 1
            })
        })
    },

    showDetail(event){
        console.log(photoArr);
        
        var currentIndex = event.detail.index
        app.globalData.photoArr = photoArr
        homeModel.addPicHot(photoArr[currentIndex].picId, 1)
        wx.redirectTo({
            url: `/pages/album/detail/detail?index=${currentIndex}&room_no=${app.globalData.roomInfo.room_no}`
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this._loadPhotos()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})