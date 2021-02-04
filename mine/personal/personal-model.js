import { Base } from '../../utils/base.js'

var app = getApp()

class Personal extends Base {
    constructor() {
        super()
    }

    updateUserInfo(data) {
        data.unionId = app.globalData.unionid
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.Updatauser,
                method: 'POST',
                header: {
                    "Content-Type": "application/json",
                    accessToken: app.globalData.mtq_token
                },
                data,
            }).then(res => {
                this.request({
                    url: this.apiSettings.GetUserPhoneByUnionId,
                    method: 'POST',
                    data: {
                        openid: app.globalData.unionid
                    }
                }).then(res => {
                    app.globalData.userInfo = res.result
                    app.globalData.userInfo.mobileNo = res.result.mobileNo
                })
                resolve(res)
            })
        })
    }
}

export { Personal }