import { Base } from '../../utils/base.js'

class Art extends Base {

    constructor() {
        super()
    }
    // 用户活动状态
    getLikeInfo(unionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: `${this.apiSettings.GetActivityLikeInfo}${unionId}`,
                data:{},
                header:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
    getInfoByActivityId(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: `${this.apiSettings.getVideoInfoById}`,
                data,
                header:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'POST'
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Art }