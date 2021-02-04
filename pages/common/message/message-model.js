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
    listMessage(unionid,page,size) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.newsList,
                method: 'post',
                header: { "Content-Type": "application/json" },
                data: {
                    pageNo:page,
                    pageSize:size,
                    unionId: unionid
                }
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