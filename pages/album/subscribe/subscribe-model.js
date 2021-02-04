import { Base } from '../../../utils/base.js'

var app = getApp()
class Subscribe extends Base {

    constructor() {
        super()
    }
     
     // 查询代金券 - 新
    searchCoupon(config){
        const { unionid } = app.globalData;
        return new Promise((resolve, reject)=>{
              this.request({
                    url: `/wfa/order/coupon/photo/getByPartInfo?unionId=${unionid}&partNo=${config.GoodsId}&catalogNo=${config.catalog_no}`,
                    method: 'GET'
              }).then(res => {
                  resolve(res);
              }).catch(err => {
                  reject(err);
              })
        })
    }
    /**
     * 预约门店
     * @param {*} data 
     */
    saveStore(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: '/wfa/order/saveStore',
                method: 'POST',
                header: {'content-type':'application/json'},
                data
            }).then( res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 保存预约信息
     */
    saveAdvancePhotos(data) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveAdvancePhotos,
                method: 'POST',
                data
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 加载预约信息
     * @param {*} data 
     */
    getAdvancePhotos(data) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetAdvancePhotos + '?mobileNo=' + data.mobile_no + '&unionId=' + app.globalData.userInfo.unionId + '&activityId=' + app.globalData.activityInfo.activityId,
                method: 'Get',
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 加载预约信息 /photoGrapher/getAdvancePhotosCount
     * @param {*} data 
     */
    getAdvancePhotosCount() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetAdvancePhotosCount + '?activityId=' + app.globalData.activityInfo.activityId + '&unionId=' + app.globalData.userInfo.unionId,
                method: 'Get',
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 获取当前可用摄影师
     */
    getPhotographerList(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPhotographer,
                method: 'POST',
                data: {
                    PageIndex: 1,
                    PageSize: 50,
                    Province: data.province,
                    City: data.city
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Subscribe }