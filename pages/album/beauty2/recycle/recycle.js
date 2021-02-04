import filmModel from '../film/film-model'

var app = getApp()
var app = getApp()
var range = { max: 40, min: 40 }
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showTips: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function () {
        wx.hideShareMenu()
        wx.setNavigationBarTitle({
            title: `设计片-回收站`
        })
        range = await filmModel.getRange()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        var list = await filmModel.getFilms(0)
        this.setData({
            list
        })
    },

    toDetail(e){
        app.globalData.photoArr = this.data.list
        wx.navigateTo({
            url: '../detail/detail?recycle=1&index=' + e.currentTarget.dataset.index
        })
    },

    close(){
        this.setData({ showTips: false })
    },

    async complete(){
        var list = await filmModel.getFilms(1)
        if(list.length > range.max || list.length < range.min){
            return wx.showToast({
                title: `添加失败，制作相册照片数不能多于${range.max}张且不能少于${range.min}张`,
                icon: 'none'
            })
        }
        await filmModel.getUnionid()
        var res = await filmModel.comfirmPick()
        this.setData({ showTips: false })
        wx.showToast({
            title: res.message,
            icon: 'none'
        })
    }
})