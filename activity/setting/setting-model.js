import { Base } from '../../utils/base'

var app = getApp()

class Activity extends Base{
    
    constructor() {
        super()
    }

    /**
     * 获得参与活动记录
     */
    getRecord(){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetLotteryRecord,
                method: 'GET',
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 获得房间活动记录
     */
    getRoomRecord(){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetRoomActivityRecord,
                method: 'GET',
                data: {
                    activityId: app.globalData.activityInfo.activityId
                    // activityId: 'hc-f-941208'
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 保存自定义活动
     */
    saveAvtivity(config){
        return new Promise((resolve,reject) => {
            var content = config.prizeRules.reduce((acc, curValue) => acc + curValue.prizeNameList, '')
            this.verifyContent(content + config.eventName).then(isLegal => {
                if(isLegal){
                    this.request({
                        url: this.apiSettings.SaveActivityRule,
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            eventName: config.eventName,
                            endTime: config.endDate,
                            startTime: config.beginDate,
                            activityId: app.globalData.activityInfo.activityId,
                            type: 1,
                            signInRule: {
                                prizeRules: config.prizeRules
                            }
                        }
                    }).then(res => {
                        resolve(res.result)
                    })
                }else{
                    reject('文字审核不通过')
                }
            })
        })
    }
    /**
     * 获取个人参与活动记录
     */
    getPersonalRecord(){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetPersonalRecord,
                method: 'GET',
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 获取单次活动全部中奖人员
     */
    getSingleActivityRecord(eventId){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetSingleActivityRecord,
                method: 'GET',
                data: {
                    eventId
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 获取相关类型活动集合
     */
    getRelatedAcrivity(){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetRelatedActivity,
                method: 'GET',
                data: {
                    type: app.globalData.activityInfo.type,
                    activityId: app.globalData.activityInfo.activityId
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 暂停/结束/开始活动
     */
    changeState(eventId, state){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.ChangeActivityState,
                method: 'GET',
                data: {
                    activityId: app.globalData.activityInfo.activityId,
                    eventId,
                    state
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    
}

export default new Activity()