import { Base } from '../../utils/base.js'

var app = getApp()

class Mine extends Base{
    constructor() {
        super()
    }

    getFllows(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetFollows,
                method: 'GET',
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Mine }