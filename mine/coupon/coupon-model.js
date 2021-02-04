import { Base } from '../../utils/base'
var app = getApp()

class Mine extends Base{

    constructor() {
        super()
    }

    getCoupons(state){
        return new Promise((resolve,reject) => {
            // this.request({
            //     url: this.apiSettings.QueryCoupon,
            //     method: 'POST',
            //     data: {
            //         "CustomerNo": app.globalData.userInfo.memberId,
            //         State:state, // Closed Created
            //         pagesize: 99,
            //         pageindex: 1
            //     }
            // }).then( res => {
            //     resolve(res);
            // }).catch( err => reject(err) )
            this.request({
                url: this.apiSettings.ConponList,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    status: state, // Closed Created
                    pageSize: 99,
                    pageNum: 1
                }
            }).then( res => {
                resolve(res);
            }).catch( err => reject(err) )
        })  
    }
}

export { Mine }