import { Base } from '../../../utils/base.js'

var app = getApp()

class Createdynamics extends Base {
    constructor() {
        super()
    }
    /**
     * 列出活动默认标签
     */
    listDefaultTags(id){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListDefaultTags,
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 新增动态
     */
    movementAdd(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.MovementAdd,
                method: 'POST',
                header:'application/json',
                data
            }).then(res => {
                resolve(res)
            })
        })
    }
    //删除
    removeImg(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: app.globalData.ossApi + 'api/fileapi/DeleteCPhotos',
                method: 'POST',
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data
            }).then(res => {
                resolve(res)
            })
        })
    }

    getDiscoverInfoDetail(id = ''){
        return new Promise((resolve, reject)=>{
            this.request({
                url: this.apiSettings.getDiscoverDetail,
                header: {"Content-Type": "application/json"},
                method: 'POST',
                data:{
                    id
                } 
            }).then( res =>{
               resolve(res)
            })
        })
    }
}
export { Createdynamics }