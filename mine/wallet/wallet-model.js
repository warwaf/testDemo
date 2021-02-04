import { Base } from '../../utils/base.js'

var app = getApp()

class Wallet extends Base{
    
    constructor() {
        super()
    }

    withdraw(amount){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.withdraw,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    amount
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    
}

export default new Wallet()