import { Base } from '../../../utils/base'

class Activity extends Base {

    constructor() {
        super()
    }
    // 报名状态
    getConfig(activityId){
        return new Promise((resolve, reject) => {
            this.request({
                url: `${this.apiSettings.ActivityBanenr}?activityId=${activityId}`,
                data:{ },
                header:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'post'
            }).then(res => {
                resolve(res)
            })
        })
    }
  
}

export { Activity }