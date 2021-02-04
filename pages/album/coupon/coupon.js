import { Coupon } from './coupon-moel.js'

var couponModel = new Coupon()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        // receivedList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
    },

    acquire(e){
        var currentId = e.currentTarget.dataset.id
        var coupons = wx.getStorageSync('property').split(",")
        coupons.push(currentId)
        console.log(coupons)
        wx.setStorageSync('property', coupons.join(','))
        this.getList()
    },

    getList(){
        var couponArr = wx.getStorageSync('property').split(",")
        couponModel.getCounpons().then(list => {
            list.forEach((item, index) => {
                list[index].alreadyGot = couponArr.indexOf(item.id + "") == -1
            })
            this.setData({
                list
            })
        })
    },
    goHome(){
        wx.navigateBack({delta:1});
    },
    download(e){
        var qrcode_url = e.currentTarget.dataset.content
        wx.showLoading({
            title: '下载中'
        })
        wx.getImageInfo({
            src: qrcode_url,
            success: res => {
                wx.hideLoading()
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: result => {
                        wx.showToast({
                            title: '下载成功'
                        })
                    }
                })
            }
        })
    }
})