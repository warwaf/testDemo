import { Base } from '../../../utils/base.js'

var app = getApp()

class Arrange extends Base{
    
    constructor() {
        super()
    }

    GetHistoryRecord(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetRecord,
                method: 'POST',
                header: { "Content-Type": "application/json" },
                data: {
                    unionId: app.globalData.userInfo.unionId,
                    // unionId: 'oYnHqs2aqkQE28GRBnTDMK-jfk7s',
                    // productNo: 'NS2501'
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 获取所有的商品列表
     */
    GetCatalogList(id){
        return new Promise((resolve, reject) => {
            this.request({
                url: '/admin/catalog/beauty/list?discoverId='+id,
                method: 'get',
                header: { "Content-Type": "application/json" },
            }).then(res => {
                resolve(res.result)
            }).catch(err=>{
                reject(err)
            })
        })
    }
    
}

export { Arrange }