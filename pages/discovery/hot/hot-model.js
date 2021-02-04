import { Base } from '../../../utils/base.js'

class Hot extends Base {

    constructor() {
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
     * 最热列表
     */
    getHotest(discoverId, pageNum, pageSize) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetMovementByPraise,
                data: {
                    discoverId,
                    pageNum,
                    pageSize
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Hot }