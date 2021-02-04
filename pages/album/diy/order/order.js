import { Diy } from '../diy-model'
import { regionToCode, getLocaltion } from '../../../../utils/util'

var app = getApp()
var diyModel = new Diy()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sendByPost: true, //邮寄还是自提
        address: {},
        addressCode: {},
        addressIndex: 0, //当前选择地址索引
        orderInfo: {},
        priceInfo: {},
        quantity: 1,
        voucherID: '',
        voucherAmount: 0,
        isLoading: false,
        shippingFee:0, // 运费金额
        couponList: [],
        showCouponList: false,
        curCouponIndex: 0,
        couponPrice:0, // 优惠券金额
        productPrice:0, // 商品价格 
        countPrice:0, // 总价格
        onePrice:0, // 单个商品的价格
        preferentialCode:'', // 优惠券编码
        shipRule:'' // 配送方式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        var workId = options.job_id ? options.job_id : app.globalData.workId || ""
        app.globalData.workId = workId
        // --------------------------测试数据----start-----------------------
        // app.globalData.workId = 'W0585490520200610'
        // app.globalData.unionid = "oYnHqszJdK8gzKciXEX7r4GE4rzs"
        // app.globalData.openid = "ozgs_5d8QEv6ZQlYtOyj4c1NGgr8"
        // app.globalData.userInfo = {
        //     avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJZuV9VnSK3ibnu0feVS4c6RHHkyeLYFqeB5BkmwsISpFNV0NXEUM0vghO6UkoS5KGsyjibKEqkRW3w/132",
        //     cardTakeStatus: 0,
        //     city: "Dongguan",
        //     country: "China",
        //     createTime: "2020-05-13 16:26:55",
        //     gender: 1,
        //     id: 7213,
        //     isMember: 1,
        //     language: "zh_CN",
        //     lastTime: "2020-06-18 15:30:00",
        //     mobileNo: "15992921683",
        //     nickName: "YWH.",
        //     openId: "ozgs_5d8QEv6ZQlYtOyj4c1NGgr8",
        //     province: "Guangdong",
        //     remarks1: "小程序",
        //     unionId: "oYnHqszJdK8gzKciXEX7r4GE4rzs"
        // }


        // app.globalData.diyConfig = {
        //     catalogNo: "1007007",
        //     catalogNoName: "6寸照片冲印",
        //     catalogUrl: "https://hcmtq.oss-accelerate.aliyuncs.com/Catalog/catalogtab/1007007.jpg",
        //     colour: null,
        //     customerName: "鲜檬摄影檬太奇形象店",
        //     customerNo: "D8990",
        //     deliveryType: "F13",
        //     detailUrl: "https://hcmtq.oss-accelerate.aliyuncs.com/Catalog/1007007.jpg",
        //     detailsUrl: "https://hcmtq.oss-accelerate.aliyuncs.com/Catalog/1007007.jpg",
        //     diyId: "51",
        //     diyType: 2,
        //     diyUrl: "https://diy.hucai.com/MobileDIY/GoMtqPreview?returnUrlView=/pages/mine/diylist/diylist&returnUrlOrder=/pages/album/diy/order/order",
        //     id: 5,
        //     listPrice: 24,
        //     marketPrice: 24,
        //     maxPage: 20,
        //     minPage: 20,
        //     pageHeight: 153,
        //     pageNo: null,
        //     pageSize: null,
        //     pageWidth: 105,
        //     partNo: "NS00301",
        //     partNoName: "6寸照片冲印",
        //     partType: null,
        //     state: 1,
        //     templetNo: "51",
        //     typeId: 2
        // }

        // app.globalData.activityInfo = {
        //     type: 2,
        //     activityType: '2001'
        // }
        // ---------------------测试数据----end---------------------------
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function() {
        //是否为冲印（特殊房间）
        var city = ''
        if (app.globalData.activityInfo.type === 2) {
            if(!app.globalData.activityType || app.globalData.activityType == '2001'){
                try {
                    city = await getLocaltion();
                } catch (error) {
                    wx.showToast({
                        title: error.errMsg,
                        icon: 'none'
                    })
                }
                this.data.city = city
                    //深圳 东莞不显示自提，  泰安地区显示为自提 || city.indexOf("东莞") != -1
                if (city.indexOf("泰安") != -1 ) {
                    this.setData({
                        sendByPost: false,
                        address: false
                    })
                }
            }
            if(app.globalData.activityType == 2002){
                this.setData({
                    sendByPost:true
                })
            }
        }

        wx.showLoading()
        //获取订单信息
        var orderInfo = await diyModel.getOrderInfo(app.globalData.workId)
        if(!orderInfo){
            wx.hideLoading()
            wx.showToast({
                title: '获取订单信息失败',
                icon: 'none'
            })
        }
        
        //选择地址列表中的哪一条
        var addressIndex = app.globalData.addressSelectIndex ? app.globalData.addressSelectIndex : 0
        const { catalogNo, partNo, customerNo, deliveryType } = app.globalData.diyConfig;
        //邮寄还是自提
        if (this.data.sendByPost) {
            //获取地址信息  地址编码信息/地址信息  默认选列表第一个  没有显示添加按钮
            try {
                var list = await diyModel.getAddress(100)
                if (list.length > 0) {
                    this.setData({
                        address: list[addressIndex],
                        addressCode: list[addressIndex],
                        addressIndex
                    })
                } else {
                    this.setData({
                        address: false,
                        addressCode: false
                    })
                }
            } catch (error) {
                wx.hideLoading()
                wx.showToast({
                    title: '获取地址信息失败:' + error,
                    icon: 'none'
                })
            }
        } else {
            //判断是否从选择页面返回
            if (addressIndex > 0) {
                try {
                    var list = await diyModel.getStore()
                    for (let index = list.length - 1; index >= 0; index--) {
                        if (list[index].addressInfo.indexOf(city) == -1) {
                            list.splice(index, 1)
                        }
                    }
                    this.setData({
                        address: list[addressIndex - 1],
                        addressCode: list[addressIndex - 1]
                    })
                } catch (error) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '获取地址信息失败:' + error,
                        icon: 'none'
                    })
                }
            }
        }
        // 计算运费
        try {
            var cacl = await diyModel.calcCost({
                storeId: orderInfo.customerNo,
                shipCode: deliveryType,
                province:  list[addressIndex] && list[addressIndex].Province ? list[addressIndex].Province : null,
                city: list[addressIndex] && list[addressIndex].City ? list[addressIndex].City: null
            })
        } catch (error) {
            wx.hideLoading()
            wx.showToast({
                title: '获取运费信息失败:' + error,
                icon: 'none'
            })
        }

        this.setData({ 
            orderInfo, 
            shipRule: deliveryType,
            onePrice:  parseInt(orderInfo.listPrice),
            productPrice: Number(orderInfo.listPrice).toFixed(2),
            shippingFee: Number(cacl.result).toFixed(2)
        })

        try {
            this.data.postage = parseInt(cacl.result)   //保存初始运费
        } catch (error) {
            wx.hideLoading()
            wx.showToast({
                title: '获取运费信息失败:' + error,
                icon: 'none'
            })
        }

        if(this.data.curCouponIndex == 0){
            this.getCouponInfo()
        }
        wx.hideLoading()
    },


    async getCouponInfo(){     
        //优惠券信息
        // var couponInfo = await diyModel.queryCoupon(this.data.orderInfo.partNo)
        const { catalogNo, partNo, customerNo, deliveryType } = app.globalData.diyConfig;
        // 获取优惠券价格
        const coupon = await diyModel.searchCoupon({GoodsId:partNo,catalog_no:catalogNo,storeId:customerNo});
        //默认拿第一个优惠券
        const couponMoney = coupon.length > 0 ? Number(coupon[0].CouponMoney).toFixed(2) : 0.00
        var countPrice = 0
        if(coupon[0].OrderContainPostage == "true"){
            let price = parseFloat(this.data.orderInfo.listPrice) + parseFloat(this.data.postage) - couponMoney
            countPrice = price < 0 ? Number(0).toFixed(2) : Number(price).toFixed(2)
        }else{
            let price = Number(this.data.orderInfo.listPrice) - couponMoney < 0 ? 0 : Number(this.data.orderInfo.listPrice) - couponMoney
            countPrice = Number(price + parseFloat(this.data.postage)).toFixed(2)
        }
        this.setData({
            couponList: coupon,
            couponPrice: couponMoney,
            preferentialCode: coupon.length > 0 ? coupon[0].CouponNo : '',
            countPrice
        })
    },

    toAddress() {
        if (this.data.sendByPost) {
            app.globalData.addressSelectIndex = false
            wx.navigateTo({
                url: "../address/address?index=" + this.data.addressIndex
            })
        } else {
            wx.navigateTo({
                url: "/pages/album/diy/store/store?city=" + this.data.city
            })
        }
    },

    call() {
        wx.makePhoneCall({
            phoneNumber: this.data.address.phone
        })
    },

    changeQuantity(e) {
        var quantity = this.data.quantity
        if (e.currentTarget.dataset.symbol) {
            quantity = quantity + 1
        } else {
            if (quantity <= 1) {
                wx.showToast({
                    title: '至少购买一个',
                    icon: 'none'
                })
                return
            }
            quantity = quantity - 1
        }
        const {onePrice, shippingFee, couponPrice } = this.data;
        const totalPrice = parseInt(onePrice) * parseInt(quantity)
        
        this.setData({ 
            productPrice: totalPrice.toFixed(2),
            countPrice:  Number(totalPrice + parseInt(shippingFee) - parseInt(couponPrice)).toFixed(2),
            quantity
        })
    },

    toPay() {
        const { orderInfo, quantity,address, countPrice, preferentialCode, shipRule, couponPrice } = this.data;
        if (!address.Province) {
            wx.showToast({
                title: '请先选择地址',
                icon: 'none'
            })
            return
        }
        var data = {
            lineItems:[{
                "goodsId": orderInfo.partNo,       //商品编码         
                "productId":orderInfo.catalogNo,                //产品编码
                "buyQty":quantity,                //数量
                "webUrl":" ",                
                "workId": app.globalData.workId,                //作品id
                "partType":"00"                
            }],
            address:{
                province: address.Province,
                city: address.City,                
                area: address.District,       
                areaCode: address.ConTryCode,//虎门镇的编码,
                address: address.Address,                
                contact: address.ReceiverName,    //联系人            
                mobileNo: address.ReceiverPhone,                
                postNo:" "
            },
            "orderAmount":countPrice,           //计算订单金额     
            "noteText":"檬太奇数据",
            shipRule,                //配送方式
            "unionId": app.globalData.unionid,             //unionId   
            preferentialCode,                //优惠券编码
            "orderSource": orderInfo.customerNo ,//门店
            "storeId": orderInfo.customerNo//门店
        }
        /* 订单测试数据 start */
        // let data1 = {
        //     lineItems:[{
        //         "goodsId": "NS00064", //商品编码         
        //         "productId": "1005567", //产品编码
        //         "buyQty": 1, //数量
        //         "webUrl": " ",                
        //         "workId": "", //作品id
        //         "partType": "00"                
        //     }],
        //     address:{
        //         "province": "北京市",
        //         "city": "北京市",              
        //         "area": "延庆区",      
        //         "areaCode": "102100", //虎门镇的编码,
        //         "address": "好几家",              
        //         "contact": "1222", //联系人            
        //         "mobileNo": "15992921683",                
        //         "postNo": " "
        //     },
        //     "orderAmount": "0.01", //计算订单金额     
        //     "noteText": "檬太奇数据",
        //     "shipRule": "B02", //配送方式
        //     "unionId": "oYnHqszJdK8gzKciXEX7r4GE4rzs", //unionId   
        //     "preferentialCode": "", //优惠券编码
        //     "orderSource": "D4260", //门店
        //     "storeId": "D4260" //门店
        // }
        /* 订单测试数据 end */
        this.setData({ isLoading: true })
            //创建订单
        diyModel.createOrder(data).then(res => {
            if (res.code == 200) {
                console.log("下单成功 >>", res)
                diyModel.saveOrderNo({
                    orderNo: res.result.OrderNo,
                    workId: app.globalData.workId
                }).then(() => {
                    this.setData({ isLoading: false })
                    wx.redirectTo({
                        url: `../pay/pay?order_no=${res.result.OrderNo}&amount=${countPrice}&couponPrice=${couponPrice}`
                    })
                }).catch(err => {
                    this.setData({ isLoading: false })
                })
            }
        }).catch(err => {
            this.setData({ isLoading: false })
        })
    },

    pickCoupon(curIndex){
        var preferentialCode, couponPrice, countPrice, shippingFee
        if(curIndex === -1){
            preferentialCode = ''
            couponPrice = 0
            // shippingFee = this.data.postage
            countPrice = Number(parseInt(this.data.orderInfo.listPrice) + parseInt(this.data.postage)).toFixed(2)
        }else{
            preferentialCode = this.data.couponList[curIndex].CouponNo
            couponPrice = Number(this.data.couponList[curIndex].CouponMoney).toFixed(2)
            // shippingFee = this.data.couponList[curIndex].OrderContainPostage == "true" ? 0 : parseInt(this.data.postage)
            if(this.data.couponList[curIndex].OrderContainPostage == "true"){
                countPrice = parseInt(this.data.orderInfo.listPrice) + this.data.postage - this.data.couponList[curIndex].CouponMoney
                countPrice = countPrice < 0 ? Number(0).toFixed(2) : Number(countPrice).toFixed(2)
            }else{
                countPrice = parseInt(this.data.orderInfo.listPrice) - this.data.couponList[curIndex].CouponMoney
                countPrice = countPrice < 0 ? Number(this.data.postage).toFixed(2) : Number(countPrice + this.data.postage).toFixed(2)
            }
        }
        this.setData({
            couponPrice,
            preferentialCode,
            countPrice,
            curCouponIndex: curIndex
        })
    },

    showCouponList(){
        wx.navigateTo({
            url: `../coupon/coupon?curIndex=${this.data.curCouponIndex}`
        })
    }
})