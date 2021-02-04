import { Base } from '../../../utils/base.js'
var app = getApp()

class Search extends Base {
    constructor() {
        super()
    }

    /**
     * 获取相册的所有图片 带分页
     * @param {*} data 
     */
    listAll(data){
        return new Promise((resolve,reject) => {
            this.request({
                url:'/wfa/faceInfo/listAll',
                data,
                // header: {
                //     "Content-Type": "application/json"
                // },
                method: "get"
            }).then(res =>{
                resolve(res)
            })
        })
    }
    /**
     * 保存 faceid 到 相册
     * @param {*} data 
     */
    faceSave(data){
        return new Promise((resolve,reject) => {
            this.request({
                url:'/wfa/userFace/save',
                data,
                header: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            }).then(res =>{
                resolve(res)
            })
        })
    }
    /**
     * 获取 faceid
     * @param {*} data 
     */
    getFace(data){
        return new Promise((resolve,reject) => {
            this.request({
                url:'/wfa/userFace/get',
                data,
                method: "POST"
            }).then(res =>{
                resolve(res)
            })
        })
    }

    // 获取个性图片
    getPhotosByClass(data){
        return new Promise((resolve,reject) => {
            this.request({
                url:'/wfa/activityRoom/getPhotosByClass',
                data,
                method: "GET"
            }).then(res =>{
                resolve(res)
            })
        })
    }
    getAllClassByRoom(activityId){
        return new Promise((resolve, reject)=>{
            this.request({
                url:'/wfa/faceInfo/getAllClassByRoom',
                data:{ activityId },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
    getAnalysicInfoByGroup() {
            return new Promise((resolve, reject) => {
                this.request({
                    url: '/faceInfo/getAnalysicInfoByGroup',
                    data: {
                        unionId: app.globalData.userInfo.unionId,
                        activityId: app.globalData.roomInfo.room_no
                    },
                    method: 'GET'
                }).then(res => {
                    resolve(res)
                })
            })
        }
        /**
         *  自己
         */
    getFaceByGroupFaceId() {
            console.log(app.globalData.userInfo.groupFaceId)
            return new Promise((resolve, reject) => {
                this.request({
                    url: this.apiSettings.GetFaceByGroupFaceId,
                    data: {
                        groupFaceId: app.globalData.userInfo.groupFaceId
                    },
                    method: 'GET'
                }).then(res => {
                    resolve(res)
                })
            })

        }
        /**
         *  万人迷
         */
    listMostAttrative(id) {
            return new Promise((resolve, reject) => {
                this.request({
                    url: this.apiSettings.ListMostAttrative,
                    data: {
                        activityId: id
                    },
                    method: 'GET'
                }).then(res => {
                    resolve(res)
                })
            })

        }
        /**
         *  全部的
         */
    listAllByActivityId(id,classType) {
            const data = { activityId: id,  pageSize: 100, pageNo: 1}
            if(classType) data['classType'] = classType;
            return new Promise((resolve, reject) => {
                this.request({
                    url: this.apiSettings.Getfacelist,
                    data,
                    method: 'GET'
                }).then(res => {
                    resolve(res.result.list)
                })
            })

        }
        /**
         *  推荐人员列表
         */
    listRecommendationByActivityIdAndGroupFaceId(id) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListRecommendationByActivityIdAndGroupFaceId,
                data: {
                    activityId: id,
                    faceId: app.globalData.userInfo.groupFaceId
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })

    }
        /**
         *  其他的图片列表
         */
    listOthersImageByActivityId(id) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ListOthersImageByActivityId,
                data: {
                    activityId: id,
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }


}
export { Search }