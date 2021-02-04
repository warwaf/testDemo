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
                    activityId: imgInfo.activityId ? imgInfo.activityId: app.globalData.roomInfo.room_no,
                    picUrl: imgInfo.picUrl,
                    thumbnailUrl: imgInfo.thumbnailUrl
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 删除图片信息
     */
    delImage(picId){
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                this.request({
                    url: this.apiSettings.DeleteImageDetail,
                    method: 'POST',
                    data: {
                        picId
                    }
                }).then(res => {
                    resolve(res)
                }).catch(err =>{
                    reject(err)
                })
            })
        })
    }

    /**
     * 领取红包
     */
    // modifyRedPacket() {
    //     return new Promise((resolve, reject) => {
    //         this.request({
    //             url: this.apiSettings.ModifyRedPacket,
    //             method: 'POST',
    //             data: {
    //                 type: 2,
    //                 search_para: app.globalData.unionid,
    //                 event_id: app.globalData.roomInfo.room_no,
    //                 red_amount: 0
    //             }
    //         }).then(res => {
    //             resolve(res)
    //         })
    //     })
    // }
    modifyRedPacket() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ModifyRedPacket,
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

export { Upload }
