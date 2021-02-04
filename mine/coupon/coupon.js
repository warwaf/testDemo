import { Mine } from './coupon-model'
var mineModel = new Mine()
const {  } = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
       tabIndex:0,
       isLoading: false,
       coupons:[],
       showTips: false,
       showTypeDialog:false,
       //当前步骤
       currentStep:1,
       couponInfo:{},
    //  流程步骤
        stepList:[
            {
                url: 'https://mtqpic.oss-cn-hangzhou.aliyuncs.com/xiutu/step1.png',
                text:'第一步：选择&创建相册'
            },
            {
                url: 'https://mtqpic.oss-cn-hangzhou.aliyuncs.com/xiutu/step2.png',
                text:'第二步：点击“定制产品”'
            },
            {
                url: 'https://mtqpic.oss-cn-hangzhou.aliyuncs.com/xiutu/step3.png',
                text:'第三步：选品下单',
                text2:'为您的商品挑照片吧～'
            },
            {
                url: 'https://mtqpic.oss-cn-hangzhou.aliyuncs.com/xiutu/step4.png',
                text:'第四步：DIY制作',
                text2:'耐心制作您的精美的商品哦～'
            },
            {
                url: 'https://mtqpic.oss-cn-hangzhou.aliyuncs.com/xiutu/step5.png',
                text:'第五步：付款下单成功'
            },
            {
                url: 'https://mtqpic.oss-cn-hangzhou.aliyuncs.com/20201222145154.png',
                text:'第六步：一周左右就能拿到商品啦'
            },
            
        ],
        indicatorDots:false,
        popupProcess: false,
        popupStore: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getProducts()
    },

    /**
     * 
     */
    tabChange(e){
        const { index } = e.currentTarget.dataset;
        this.setData({
            tabIndex: index
        })
        this.getProducts();
    },
    /**
     * 获取产品列表
     */
    async getProducts(){
        const tabIndex = this.data.tabIndex;
        let state = ''
        // if(tabIndex == 0) state = 'Created';
        // if(tabIndex == 1) state = 'Closed';
        this.setData({isLoading:true,coupons:[]})
        const res = await mineModel.getCoupons(tabIndex)
        this.setData({
            isLoading:false,
            coupons:res.result
        })
    },
    closePrizeDetail(){
        this.setData({
            showTypeDialog:false,
            currentStep:1
        })
    },
    getStore () {
        wx.switchTab({
          url: '/pages/discovery/index/index',
        })
    },
    closePopup () {
        this.setData({
            showTypeDialog: false,
        })
    },
    // 滑动事件
    changeItem(e){
        // console.log(e)
        this.setData({
            currentStep:e.detail.current + 1
        })
    },

    /**
     * 使用
     */
    useCoupon(e){
        this.setData({
            couponInfo :e.currentTarget.dataset
        })
        console.log(e.currentTarget.dataset.item.PreferentialID, 'e.currentTarget.dataset.item.PreferentialID')
        if (__wxConfig.accountInfo.appId == 'wx059f9118f045da79') {
            if (e.currentTarget.dataset.item.PreferentialID=='R20201216142033061'||e.currentTarget.dataset.item.PreferentialID=='R20201216135601450') {
                this.setData({
                    popupStore: true,
                    popupProcess: false
                })
            } else if(e.currentTarget.dataset.item.PreferentialID=='R20201217161707274'){
                this.setData({
                    popupProcess: true,
                    popupStore: false
                })
            } else {
                const { type, val, item } = this.data.couponInfo
                console.log(type, 'type<<<<')
                console.log(this.data.couponInfo)
                if(val == '7折'){
                    getApp().globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_use",{})
                    wx.navigateToMiniProgram({
                        appId: 'wxbf9f2e9fde7a772d',
                        path: 'pages/goodsDetail/goodsDetail?goodsId=DSGW160&productId=1009858',
                        extraData: {
                            goodsId: 'DSGW160',
                            productId: '1009858'
                        }
                    })
                    return
                }
                if (item&&(item.CouponNo == "RMPK3338MPK" || item.CouponNo == "RXWK5531XWK" || item.CouponNo == "RPNJ3624PNJ")) {
                    getApp().globalData.styleKey = "R"
                    return wx.switchTab({
                        url: '/pages/discovery/index/index'
                    })
                }
                if(type == 'P'){
                    wx.switchTab({
                        url: '/pages/discovery/index/index'
                    })
                }else{
                    // wx.switchTab({
                    //     url: '/pages/album/checkin/checkin'
                    // })
                    this.setData({
                        showTypeDialog:false,
                        currentStep:1
                    })
                    this.toHome();
                    return
                    this.setData({
                        showTips: true
                    })
                }
            }
        } else {
            if (e.currentTarget.dataset.item.PreferentialID=='R20201221145434996'||e.currentTarget.dataset.item.PreferentialID=='R20201221142328285') {
                this.setData({
                    popupStore: true,
                    popupProcess: false
                })
            } else if (e.currentTarget.dataset.item.PreferentialID=='R20201221143956019'){
                this.setData({
                    popupProcess: true,
                    popupStore: false
                })
            } else {
                const { type, val, item } = this.data.couponInfo
                console.log(type, 'type<<<<')
                console.log(this.data.couponInfo)
                if(val == '7折'){
                    getApp().globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_use",{})
                    wx.navigateToMiniProgram({
                        appId: 'wxbf9f2e9fde7a772d',
                        path: 'pages/goodsDetail/goodsDetail?goodsId=DSGW160&productId=1009858',
                        extraData: {
                            goodsId: 'DSGW160',
                            productId: '1009858'
                        }
                    })
                    return
                }
                if (item&&(item.CouponNo == "RMPK3338MPK" || item.CouponNo == "RXWK5531XWK" || item.CouponNo == "RPNJ3624PNJ")) {
                    getApp().globalData.styleKey = "R"
                    return wx.switchTab({
                        url: '/pages/discovery/index/index'
                    })
                }
                if(type == 'P'){
                    wx.switchTab({
                        url: '/pages/discovery/index/index'
                    })
                }else{
                    // wx.switchTab({
                    //     url: '/pages/album/checkin/checkin'
                    // })
                    this.setData({
                        showTypeDialog:false,
                        currentStep:1
                    })
                    this.toHome();
                    return
                    this.setData({
                        showTips: true
                    })
                }
            }
        }
        this.setData({
            showTypeDialog:true,
            currentStep:1
        })
    },

    employ(e){
        const { type, val, item } = this.data.couponInfo
        console.log(type, 'type<<<<')
        console.log(this.data.couponInfo)
        if(val == '7折'){
            getApp().globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_use",{})
            wx.navigateToMiniProgram({
                appId: 'wxbf9f2e9fde7a772d',
                path: 'pages/goodsDetail/goodsDetail?goodsId=DSGW160&productId=1009858',
                extraData: {
                    goodsId: 'DSGW160',
                    productId: '1009858'
                }
            })
            return
        }
        if (item&&(item.CouponNo == "RMPK3338MPK" || item.CouponNo == "RXWK5531XWK" || item.CouponNo == "RPNJ3624PNJ")) {
            getApp().globalData.styleKey = "R"
            return wx.switchTab({
                url: '/pages/discovery/index/index'
            })
        }
        if(type == 'P'){
            wx.switchTab({
                url: '/pages/discovery/index/index'
            })
        }else{
            // wx.switchTab({
            //     url: '/pages/album/checkin/checkin'
            // })
            this.setData({
                showTypeDialog:false,
                currentStep:1
            })
            this.toHome();
            return
            this.setData({
                showTips: true
            })
        }
    },

    toHome(){
        wx.switchTab({
            url: '/pages/album/checkin/checkin'
        })
    }
})