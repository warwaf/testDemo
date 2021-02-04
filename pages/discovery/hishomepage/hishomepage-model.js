import { Base } from '../../../utils/base.js'

var app = getApp()

class Hishomepage extends Base {
    constructor() {
        super()
    }
    getUserPhoneByUnionId(unionid){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetUserPhoneByUnionId,
                method: 'POST',
                data: {
                    openid: unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
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
export { Hishomepage }