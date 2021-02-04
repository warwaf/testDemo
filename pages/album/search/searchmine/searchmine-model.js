import { Base } from '../../../../utils/base.js'
var app = getApp()

class Searchmine extends Base {
    constructor() {
            super()
        }
        /**
         *  全部的自己的头像
         */
    listAllByActivityId(unionid, url) {
            return new Promise((resolve, reject) => {
                this.request({
                    url: this.apiSettings.Getfacelist,
                    data: {
                        unionid: unionid,
                        url: url
                    },
                    method: 'GET'
                }).then(res => {
                    resolve(res)
                })
            })

        }

    /**
     *  根据图片地址获取(头像)faceid
     */
    getFace(picId) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.Getfaceid,
                data: { 
                    picId,
                    activityId: app.globalData.activityInfo.activityId
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })

    }

    /**
     *  保存用户信息(groupfaceid)
     */
    updatauser(groupFaceId) {
        return new Promise((resolve, reject) => {
            var formData = {
                groupFaceId: groupFaceId,
                unionId: app.globalData.unionid
            }
            wx.request({
                url: this.apiSettings.Updatauser,
                header: {
                    "Content-Type": "application/json",
                    accessToken: app.globalData.mtq_token
                },
                method: 'POST',
                data: formData,
                success: function(res) {
                    resolve(res)
                }
            })
        })
    }

}
export { Searchmine }