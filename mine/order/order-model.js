import { Base } from '../../utils/base.js'

var app = getApp()

class Order extends Base {

    constructor() {
        super()
    }

    // static get payCode() {
    //     return {
    //         "Created": 0, // 待付款    订单状态 Created 并且 支付状态： Paid  进行中 
    //         "Released": 1, //  进行中
    //         "Scrapped": 1, // 不确定
    //         "Confirmed": 1, //  进行中
    //         "Producting": 1, //  进行中
    //         "Producted": 1, //  进行中
    //         "Delivered": 1, //  进行中
    //         "PartialDelivered": 1, // 不确定
    //         "Closed": 1, //  进行中
    //         "Cancelled": 2, // 不确定
    //         "Received": 2, // 已完成 
    //         "Returned": 2, // 不确定
    //         "Reworked": 2 // 不确定
    //     }
    // }
        /**
         * 获取订单列表
         */
    getOrderList(type, pageNum, pageSize) {
        let baseUrl = `?unionId=${app.globalData.unionid}&pageNum=${pageNum}&pageSize=${pageSize}`;
        if(type != 0) baseUrl += `&type=${type}`
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetSelfOrderList + baseUrl,
                method: 'POST',
            }).then(res => {
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    /**
     * 获得订单信息
     */
    getOrderInfo(orderNo, trackingNo) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetOrderDetail + `?orderNo=${orderNo}&unionId=${app.globalData.unionid}&trackingNo=${trackingNo}`,
                method: 'POST',
                // header: { "content-type": "application/json" },
                // data: {
                //     orderNo: orderNo,
                //     unionId: app.globalData.unionid
                //     // "OrderField": "order_no,terminal_id,order_date,order_amount,ship_cost,net_amount,contact,mobile_no,delivery_address,region_code,voucher_amount,tracking_no",
                //     // "IsTaskInfo": 1,
                //     // "OrderLineField": "line_no,part_no,catalog_no"
                // }
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    getGoodsInfo(data) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetGoosDetail + `?CustomerNo=${data.CustomerNo}&PartNo=${data.PartNo}&CatalogNo=${data.CatalogNo}&Scope=${data.Scope}`,
                method: 'POST',
                header: { "content-type": "application/json" }
            }).then(res => {
                resolve(res.data)
            })
        })
    }

    /**
     * 更新评论
     */
    updateEvaluate(data) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.UpdateEvaluate,
                method: 'POST',
                header: { "content-type": "application/json" },
                data
            }).then(res => {
                if (res.code == 0) {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    wx.showToast({
                        title: res.desc,
                        icon: 'none'
                    })
                }
            })
        })
    }
    /**
     * 获取场景
     * @param  {订单号} orderNo 
     */
    getScenes(orderNo){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetScenes,
                method: 'GET',
                data: {
                    orderNo
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 修改支付方式
     * @param {Object} params 请求参数
     */
    updatePayMethod(params) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.updatePaymentMethod,
                method: "POST",
                data: params
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 查询支付方式
     * @param {Object} params 请求参数
     */
    queryPayMethods(params){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.queryPaymentMethod,
                method: "POST",
                data: params
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 获取Sign
     */
    getSign(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getSign,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })   
    }
}

export { Order }