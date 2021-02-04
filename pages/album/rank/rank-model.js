import { Base } from '../../../utils/base.js'
var app = getApp()

class Rank extends Base {

    constructor() {
        super()
    }

    getRank(page_no = 1, page_size = 10) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPraiseRank,
                method: 'POST',
                data: {
                    activity_id: app.globalData.roomInfo.room_no,
                    pageNum: page_no,
                    pageSize: page_size
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    getRank2(page_no = 1, page_size = 10) {
        return new Promise((resolve, reject) => {
            // GetPhotos GetPraiseRank
            this.request({
                url: '/wfa/diy/getPhotosByActivityId',
                method: 'GET',
                data: {
                    activityId: app.globalData.activityInfo ?  app.globalData.activityInfo.activityId : app.globalData.roomInfo.room_no,
                    pageNo: page_no,
                    pageSize: page_size
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    getPhotoInfo(pic_id, room_no = '') {
        if (!room_no) {
            room_no = app.globalData.roomInfo.room_no
        }
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetCRoomPhotos,
                method: 'POST',
                data: {
                    room_no,
                    file_name: pic_id
                }
            }).then(res => {
                if (res.data.Photos[0] == undefined) {
                    this.request({
                        url: this.apiSettings.GetCRoomPhotos,
                        method: 'POST',
                        data: {
                            room_no: room_no + '-share',
                            file_name: pic_id
                        }
                    }).then(result => {
                        resolve(result.data.Photos[0])
                    })
                } else {
                    resolve(res.data.Photos[0])
                }
            })
        })
    }

}

export { Rank }