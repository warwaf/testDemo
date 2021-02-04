import { Base } from '../../../utils/base.js'

var app = getApp()

class Checkin extends Base{
    
    constructor() {
        super()
    }

    gethistoryInfo(pageNo = 1, pageSize = 10, type = 0) {
        return this.request({
            url: type == 0 ? this.apiSettings.GetSelfEventHistroy : this.apiSettings.GetShareEventHistroy,
            data: {
                unionId: app.globalData.unionid,
                pageNo,
                pageSize
            }
        })
    }

    getAds() {
        return this.request({
            method: 'POST',
            url: this.apiSettings.GetAds,
        })
    }
    /**
     * 获取签到日历 
     */
    // getPrizeList(){
    //     return new Promise((resolve,reject) => {
    //          this.request({
    //             url: '/wfa/signIn/getPrizeList?unionId='+ app.globalData.unionid
    //          }).then(res => {
    //             resolve(res)
    //          }).catch(err => {
    //             reject(err)
    //          })
    //     })
    // }
    /**
     * 点击签到 获取红包金额
     */
    getSignIn(){
        return new Promise((resolve,reject) => {
             this.request({
                url: '/wfa/signIn/?unionId='+app.globalData.unionid,
                method: 'POST',
             }).then(res => {
                resolve(res)
             }).catch(err => {
                reject(err)
             })
        })
    }
    /**
     * 保存拉新邀请记录
     */
    saveInviteRecord(unionId, masterUnionId, activityName){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveInviteInfo,
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    unionId,
                    masterUnionId,
                    activityName
                }
            }).then(res => {
                resolve(res.message)
            })
        })
    }
}

export { Checkin }