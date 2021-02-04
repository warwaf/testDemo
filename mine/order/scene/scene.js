import { Order } from '../order-model'
var orderModel = new Order()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: [],
        orderNo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.orderNo = options.orderNo
        orderModel.getScenes(options.orderNo).then(res => {
            this.setData({
                data: res
            })
        })
    },

    toEvaluate(e) {
        wx.navigateTo({
            url: `../evaluate/evaluate?orderNo=${this.data.orderNo}&jobId=${e.currentTarget.dataset.id}`
        })
    },

    submit() {
        wx.showModal({
            title: '提示',
            content: '亲，你真的要退出吗？友情提醒：退出就不能再评价了呢/(ㄒoㄒ)/~~',
            success() {
                console.log(123);
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
})