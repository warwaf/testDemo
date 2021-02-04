import { Base } from '../../utils/base.js'

var app = getApp()

class Invitation extends Base{
    
    constructor() {
        super()
    }
    
    getInvitations(){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetInvitationList,
                method: 'GET'
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    getRecords(){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetInvitationRecord,
                method: 'GET',
                data: {
                    unionId: app.globalData.userInfo.unionId
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

}

export const InvitationModel = new Invitation()