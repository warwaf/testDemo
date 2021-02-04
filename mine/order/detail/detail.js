import {
    Order
} from '../order-model'

var orderModel = new Order()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderInfo: {},
        isLoading: false,
        showSuccess: false,
        come: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.come == 'member') {
            this.setData({
                come: options.come,
                showSuccess: true
            })
        } else {
            this.setData({
                showSuccess: false
            })
        }
        this.setData({
            isLoading: true
        })
        this.data.orderNo = options.orderNo
        this.getOrderInfo(options)
    },
    getOrderInfo(options) {
        orderModel.getOrderInfo(options.orderNo, options.trackingNo).then(res => {
            console.log(res.result);
            let infoData = res.result
            this.setData({
                orderInfo: res.result,
                isLoading: false
            })
            let spareMoney = infoData.PayPrice - infoData.PaidAmount
            console.log("spareMoney >>", spareMoney, infoData)
            this.setData({
                spareMoney: spareMoney.toFixed(2)
            })
        })
    },
    onShow: function () {
        if (!this.data.come) {
            this.setData({
                showSuccess: false
            })
        }
    },
    toRoom() {
        let _url = ""
        switch (this.data.orderInfo.roomType) {
            case 11:
                _url = `/pages/album/newBeauty/newBeauty?room_no=${this.data.orderInfo.activityId}&typeId=11`
                break;
            case 12:
                _url = `/pages/album/newBeauty/newBeauty?room_no=${this.data.orderInfo.activityId}&typeId=12`
                break;
            default:
                _url = `/pages/album/beauty/home?room_no=${this.data.orderInfo.activityId}`
                break;
        }
        wx.navigateTo({
            url: _url
        })
    },
    useNow() {
        wx.navigateTo({
            url: '/mine/coupon/coupon'
        })
        this.setData({
            showSuccess: false
        })
    },
    closeSucce() {
        this.setData({
            showSuccess: false
        })
    },
    stop() {
        return false
    },
    showHelp() {
        wx.showModal({
            title: '咨询热线',
            content: '400 805 2189'
        });
    },
    async toPay() {
        const {
            orderNo,
            orderInfo
        } = this.data;
        // spareMoney = infoData.PayPrice - infoData.PaidAmount
        // spareMoney > 0 && orderInfo.PaidAmount > 0 || orderInfo.EarnestAmount > 0 则存在尾款支付
        // payType 支付类型（1：定金、2：全款 3：尾款）
        let spareMoney = this.data.spareMoney, // .toFixed(2),
            payType = "",
            isEarnest = false // 是否为支付尾款
        switch (orderInfo.OrderOfType) {
            case "P":
                if (spareMoney > 0 && orderInfo.PaidAmount > 0 || (orderInfo.EarnestAmount > 0 && orderInfo.PayPrice != orderInfo.EarnestAmount)) {
                    isEarnest = true
                } else {
                    isEarnest = false
                }
                break;
            default:
                isEarnest = false
                break;
        }
        let tabCode = "",
            come = ""
        switch (orderInfo.memberType) {
            case 0:
                tabCode = "gold"
                come = "member"
                break;
            case 1:
                tabCode = "silver"
                come = "member"
                break;
            default:
                tabCode = ""
                come = ""
                break;
        }
        if (isEarnest) {
            if (spareMoney != orderInfo.EarnestAmount) {
                payType = "1"
            } else {
                payType = "3"
            }
            let signRes = await orderModel.getSign()
            console.log("sign res >>", signRes)
            if (signRes.code == 200) {
                let queryParams = {
                    token: signRes.result,
                    orderNo: orderNo
                }
                let queryRes = await orderModel.queryPayMethods(queryParams)
                console.log("query res >>", queryRes)
                if (queryRes.code == 200) {
                    wx.redirectTo({
                        url: `/pages/album/diy/pay/pay?order_no=${orderNo}&amount=${spareMoney}&couponPrice=${orderInfo.CouponPrice}&payType=${payType}&tabCode=${tabCode}&come=${come}`
                    })
                } else {
                    wx.showToast({
                        title: queryRes.msg,
                        icon: 'none',
                        duration: 1500,
                        mask: true
                    });
                }
            } else {
                wx.showToast({
                    title: singRes.message,
                    icon: 'none',
                    duration: 1500,
                    mask: true
                });
            }
            return
        }
        wx.redirectTo({
            url: `/pages/album/diy/pay/pay?order_no=${orderNo}&amount=${orderInfo.PayPrice}&couponPrice=${orderInfo.CouponPrice}&payType=2&tabCode=${tabCode}&come=${come}`
        })
    },

    /**
     * 评分
     */
    toScore(e) {
        wx.navigateTo({
            url: `/pages/mine/order/evaluate/evaluate?orderNo=${this.data.orderNo}`
        })
    }

})