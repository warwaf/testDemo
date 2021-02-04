import { Base } from '../../utils/base.js'

var app = getApp()

class Diy extends Base {
    constructor() {
        super()
    }

    /**
     * 获取diy 作品列表
     */
    getWorkList() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetWorkList,
                method: 'POST',
                data: {
                    branch_id: 'D8990',
                    page_size: 100,
                    page_no: 1,
                    customer_phone: app.globalData.userInfo.mobileNo,
                    status: 1
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 通过 work_no 获取 sku
     */
    getPartInfo(work_no) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPartInfo + '?workId=' + work_no,
                method: "POST"
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })

        })
    }
}

export { Diy }