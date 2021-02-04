import { Base } from '../../utils/base'

const app = getApp()

class Lottery extends Base{

    constructor(){
        super()
    }
    /**
     * 获取抽奖信息
     */
    getLotteryInfo(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetWinnerList,
                method: 'GET',
                data: {
                    unionId: app.globalData.userInfo.unionId,
                    eventId: app.globalData.activityInfo.activityPrize.eventId,
                    activityId: app.globalData.activityInfo.activityId
                    // unionId: 'oYnHqswZwqtAA0O-uvdjrp4MlJLI',
                    // eventId: 'MTQ-00073',
                    // activityId: 'hc-f-659357'
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 获取参与者名单
     */
    getAllAttend(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetAllAttend,
                method: 'GET',
                data: {
                    eventId: app.globalData.activityInfo.activityPrize.eventId,
                    activityId: app.globalData.activityInfo.activityId
                    // eventId: 'MTQ-00282',
                    // activityId: 'hc-f-941208'
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     *  开奖
     */
    excuteLottery(prizeLevel, eventId = ''){
        eventId =  eventId || app.globalData.activityInfo.activityPrize.eventId
        return new Promise((resolve, reject) => {
            this.request({
                // url: this.apiSettings.ExcuteLottery + `?eventId=MTQ-00189&activityId=hc-f-941208&eventName=猫王&prizeLevel=${prizeLevel}&consoleType=1`,
                url: this.apiSettings.ExcuteLottery + `?eventId=${eventId}&activityId=${app.globalData.activityInfo.activityId}&eventName=${app.globalData.activityInfo.activityPrize.eventName}&prizeLevel=${prizeLevel}&consoleType=1`,
                method: 'POST',
                header:{
                    'Content-Type': 'application/json'
                },
                data: {
                    eventId: app.globalData.activityInfo.activityPrize.eventId,
                    activityId: app.globalData.activityInfo.activityId,
                    eventName: app.globalData.activityInfo.activityPrize.eventName,
                    prizeLevel,
                    consoleType: 1
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

}

export default new Lottery()