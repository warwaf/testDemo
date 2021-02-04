import { Base } from '../../../utils/base.js';

var app = getApp()
class News extends Base {
    constructor() {
        super()
    }

    /**
     * 消息列表
     * @param {*} unionid 
     * @param {*} page 
     * @param {*} size 
     */
    listBeautyMessage(activityId, orderNo) {
        let url = '';
        if (activityId) {
            url = '/wfa/appointment/message?activityId=' + activityId;
        }
        if (orderNo) {
            url = '/wfa/appointment/message?orderNo=' + orderNo;
        }
        return new Promise((resolve, reject) => {
            this.request({
                url: url,
                method: 'get',
                header: { "Content-Type": "application/json" },
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 更新消息状态
     * @param {*} id 
     */
    updateMessage(id) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.updateNews,
                method: 'post',
                data: { id }
            }).then(res => {
                resolve(res)
            })
        })
    }
}
export { News }