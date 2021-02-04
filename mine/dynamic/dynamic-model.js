import { Base } from '../../utils/base.js'

var app = getApp()

class Dynamic extends Base {
    constructor() {
        super()
    }

    listByUnionId(unionid,page,size) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListByUnionId,
                method: 'GET',
                data: {
                    pageNum:page,
                    pageSize:size,
                    unionId: unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
}
export { Dynamic }