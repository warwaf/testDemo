import { Base } from '../../utils/base.js'

var app = getApp()

class Award extends Base{
    
    constructor() {
        super()
    }

    getSign(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getSign,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid
                    // unionId: 'oYnHqs51rx8cCNdCZVYUdC_yMjbs'
                }
            }).then(res => {
                resolve(res)
            })
        })   
    }
    
    getActivityCode(Sign){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GainActivityCouponInfoList,
                method: 'POST',
                data: {
                    Sign,
                    ActivityCode: 'MXQH_202003'
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    getAdwardsList () {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getAdwardsList,
                method: "GET",
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export default new Award()