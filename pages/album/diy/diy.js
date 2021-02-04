import { isLogin } from '../../../utils/util'
// pages/mine/diy/diy.js
import { Diy } from './diy-model.js'
var diyModel = new Diy()

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading()
        const activityInfo = app.globalData.activityInfo
        const products = []
        activityInfo.deployRoom.map(async item => {
            let param = {
                type: activityInfo.type,
                partNo: item.productNo,
                catalogNo: item.customerNo
            }
            let res = await diyModel.getGoodsDetail(param)
            let goods = res.result[0]
            goods.detailUrl = item.detailUrl
            goods.partNo = item.productNo
            goods.templetNo = item.templetNo
            goods.deliveryType = item.deliveryType
            const coupon = await diyModel.searchCoupon({
                GoodsId: goods.partNo,
                catalog_no: goods.catalogNo,
                storeId: goods.customerNo
            })
            if(coupon[0].CouponMoney && coupon[0].CouponMoney > 0){
                goods.hadCoupon = true
            }
            products.push(goods)
            wx.hideLoading()
            this.setData({
                products
            })
            // diyModel.getGoodsDetail().then( res => {
            //     let product = this.data.products
            //     res.result.map(items => {
            //         items.detailUrl = item.detailUrl
            //         items.partNo = item.productNo
            //         items.templetNo = item.templetNo
            //         items.deliveryType = item.deliveryType
            //     })
            //     res.result = res.result.sort((a, b) => (a.ListPrice - b.ListPrice))
            //     product = product.concat(res.result)
            //     this.setData({
            //         products: product
            //     })
            // })
        })
    },

    /**
     * 产品详情
     */
    detail(e) {
        var index = e.currentTarget.dataset.index
        const product = this.data.products[index]
        app.globalData.productNo = product.partNo
        app.globalData.diyConfig = product
        if( isLogin() ){
            wx.navigateTo({
                url: `./proList/proList?max=${product.maxPage}&min=${product.minPage}&banner=${product.detailUrl}`,
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    }

})