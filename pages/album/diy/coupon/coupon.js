import { Diy } from '../diy-model'
var diyModel = new Diy()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponList: [],
        curCouponIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const { catalogNo, partNo, customerNo, deliveryType } = app.globalData.diyConfig
        // 获取优惠券价格
        const couponList = await diyModel.searchCoupon({GoodsId:partNo,catalog_no:catalogNo,storeId:customerNo})
        this.setData({
            couponList,
            curCouponIndex: Number(options.curIndex)
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    pickCoupon(e){
        this.prevPage.pickCoupon(e.currentTarget.dataset.index)
        wx.navigateBack({
            delta: 1
        })
    }
})