import { Base } from '../../../utils/base.js'

var app = getApp()

class Upload extends Base {

    constructor() {
        super()
    }

    /**
     * 保存上传图片信息
     */
    saveImageDetail(imgInfo) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveImageDetail,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    picId: imgInfo.FileName,
                    fileName: imgInfo.FileName,
                    activityId: app.globalData.roomInfo.room_no,
                    picUrl: imgInfo.picUrl,
                    thumbnailUrl: imgInfo.thumbnailUrl
                }
            }).then(res => {
                resolve(res)
            })
        })
    }


}

export { Upload }
