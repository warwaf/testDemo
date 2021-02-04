import { Arrange } from '../arrange-model'
var arrangeModel = new Arrange()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //json文件配置失效
        wx.setNavigationBarTitle({
            title: '预约记录'
        })

        wx.setNavigationBarColor({
            backgroundColor: '#ffffff',
            frontColor: '#000000'
        })
        this.setData({isLoading: true})
        arrangeModel.GetHistoryRecord().then(res => {
            this.setData({
                list: res,
                isLoading: false
            })
        }).catch(err=>{
            this.setData({isLoading: false})
        })
    },
    tapPay(e){
        const {orderNo,orderAmount,CouponPrice} = e.currentTarget.dataset.info;
        wx.navigateTo({
            url: `/pages/album/diy/pay/pay?order_no=${orderNo}&amount=${orderAmount}&couponPrice=${CouponPrice}`,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})