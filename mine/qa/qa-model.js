import { Base } from '../../utils/base.js'

var app = getApp()

class Qa extends Base{
    
    constructor() {
        super()
    }

    getQuestionList(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getQaList,
                method: 'GET'
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    
}

export default new Qa()