var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.order_no);
        this.setData({
            url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe4bd637b575a9068&redirect_uri=https://ns.hucais.com.cn/payment/init4PictureRoom.shtml?orderno=${options.order_no}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})
