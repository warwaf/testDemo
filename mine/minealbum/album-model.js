import { Base } from '../../utils/base.js'

var app = getApp()

class Album extends Base {

    constructor() {
        super()
    }

    /**
     * 房间信息加载
     */
    getActivityInfo() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetCouponActivity,
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    
}

export { Album }

