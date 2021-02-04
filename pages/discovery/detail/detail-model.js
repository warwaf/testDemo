import { Base } from '../../../utils/base.js'

class Detail extends Base {

    constructor() {
        super()
    }

    /**
     * 最新列表
     */
    getDetail(movementId) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetMovementDetail,
                data: {
                    movementId
                },
                method: 'GET'
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 根据unionId获取作者信息
     */
    getAuthorInfo(unionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetUserPhoneByUnionId,
                method: 'POST',
                data: {
                    openid: unionId
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 点赞
     */
    praise(discoverId, movementId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.MovementPraise,
                method: 'POST',
                data: {
                    discoverId,
                    movementId,
                    unionId: getApp().globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })    
    }

    /**
     * 获得点赞数
     */
    getPraise(movementId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetMovementPraise,
                method: 'GET',
                data: {
                    movementId
                }
            }).then(res => {
                resolve(res)
            })
        })  
    }

    delect(id) {
        return new Promise((resolve, reject)=>{
            this.request({
                url: this.apiSettings.DiscoveryDelect,
                method: 'get',
                data:{id} 
            }).then( res =>{
               resolve(res)
            })
        })
    }

    /**
     * 获得点赞数
     */
    getAppointmentStat(activityCode){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getAppointmentStat,
                method: 'POST',
                header: {'Content-Type': 'application/json'},
                data: {
                    activityCode,
                    unionId: getApp().globalData.unionid
                }
            }).then(res => {
                resolve(res.result)
            })
        })  
    }

}

export { Detail }