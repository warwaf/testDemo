import { Base } from '../../utils/base'

var app = getApp()

class Activity extends Base{
    
    constructor() {
        super()
    }
    
    /**
     * 根据unionId从后台获取用户信息
     */
    getUserInfoByUnionId(force = false) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetUserPhoneByUnionId,
                method: 'POST',
                data: {
                    openid: app.globalData.unionid
                }
            }).then(res => {
                if (res.result) {
                    app.globalData.userInfo = res.result
                    app.globalData.mta.Data.userInfo = {'open_id':res.result.openId, 'phone':res.result.mobileNo};
                } else {
                    // wx.navigateTo({
                    //     url: '/pages/common/userinfo/userinfo'
                    // })
                    reject()
                }
                resolve(res)
            })
        })
    }
}

export default new Activity()