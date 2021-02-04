import { Beauty } from '../beauty-model.js'

var beautyModel = new Beauty()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onShow(){
        beautyModel.getOrderList().then(res => {
            this.setData({
                orderList: res.result
            })
        })
    },

    toEvaluate(e){
        var data = this.data.orderList[e.currentTarget.dataset.index]
        wx.navigateTo({
            url: `../evaluate/evaluate?orderNo=${data.order_no}&customerNo=${data.customer_no}&customerName=${data.customer_name}&shootType=${data.reservations_type}&shootName=${data.res_type_desc}`,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})