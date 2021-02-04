import { Base } from '../../../../utils/base.js'
var app = getApp()

class Searchresult extends Base {
    constructor() {
        super()
    }
    //根据groupfaceid列出相关图片
    listImageByGroupFaceId(activityId,groupFaceId) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListImageByGroupFaceId,
                data: {
                    activityId: activityId,
                    faceId: groupFaceId
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }

}
export { Searchresult }