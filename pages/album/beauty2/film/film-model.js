import { Base } from '../../../../utils/base.js'

var app = getApp()

class Film extends Base{

    constructor() {
        super()
    }
    
    /**
     * 硬订单-状态更新
     */
    updateFilmStatus(params) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.filmStateConfirm,
                header: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data: params
            }).then(res => {
                if(res.code == 500){
                    reject()
                    return
                }
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 获取看美照列表
     */
    getFilms(pickStatus, isNew, jobId){
        let params = {
            imageType: 6,
            activityId: app.globalData.roomInfo.room_no,
            pickStatus            
        }
        if (jobId && isNew == 1) {
            params.jobId = jobId
        }
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetSpecialImage,
                data: params
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 放入回收站
     */
    inRecycle(picId, action = ''){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.InRecycle,
                data: {
                    picId,
                    activityId: app.globalData.roomInfo.room_no,
                    unionId: app.globalData.unionid,
                    action
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    comfirmRecycle(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.InRecycle,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    comfirmPick(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ComfirmPick,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    checkComfirmStatus(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.CheckComfirmStatus,
                data: {
                    activityId: app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    getStoreByActivityId(activityId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getStoreByActivityId,
                data: {
                    activityId: activityId || app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    getRange(){
        return new Promise((resolve, reject) => {
            this.request({
                url: 'https://mtqcshi.hucai.com/test/range.json',
            }).then(res => {
                resolve(res)
            })
        }) 
    }

}

export default new Film()