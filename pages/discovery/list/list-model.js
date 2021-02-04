import { Base } from '../../../utils/base.js'
import apiSettings from '../../../utils/ApiSetting.js';

class List extends Base{

    constructor(){
        super()
    }

    // 报名状态
    checkStat(unionId,activityCode){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetSignUp,
                data:{
                    activityCode,
                    unionId,
                },
                header:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'POST'
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 最新列表
     */
    getNewest(discoverId, pageNum, pageSize, competitionNo, nickName){
        var data = {
            pageNum,
            pageSize,
        }
        if(competitionNo) data.competitionNo = competitionNo;
        if(nickName) data.nickName = nickName ;
        if (discoverId){
            data.discoverId =  discoverId
        }
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetMovement,
                data,
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
    // 领取优惠券
    getCoupon(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetConpon,
                data,
                method:'post'
            }).then(res=>{
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
    // 查询优惠券信息
    searchCouponInfo(discoverId,unionId){
        return new Promise((resolve,reject) => {
            this.request({
                url:`/wfa/order/movement/listCoupon?discoverId=${discoverId}&unionId=${unionId}`,
                method:'GET'
            }).then(res=>{
                console.log(res);
                
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
    //保存预约信息
    recordArrange(userInfo, storeId, partNo, partName){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.RecordArrange,
                header: { 'Content-Type': 'application/json' },
                method:'POST',
                data: {
                    "partNo": partNo ? partNo : "*",
                    "mobile": userInfo.mobileNo,
                    "nickName": userInfo.nickName,
                    "storeId": storeId,
                    "unionId": getApp().globalData.unionid,
                    "partName": partName ? partName : "*"
                }
            }).then(res=>{
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 获取商品列表
     * @param {String} shopNo 门店号
     * @param {Number} pageNum 当前页
     * @param {Number} pageSize 每页条数
     */
    getProductsList (shopNo, pageNum, pageSize) {
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.getProductsList,
                method:'GET',
                data: {
                    shopNo,
                    pageNum,
                    pageSize
                }
            }).then(res=>{
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    getProductDetail (shopNo, partNo) {
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.getProductDetail,
                method:'GET',
                data: {
                    shopNo,
                    partNo
                }
            }).then(res=>{
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export { List }