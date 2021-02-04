import { Base } from '../../../utils/base.js'

var app = getApp()

class Detail extends Base {

    constructor() {
        super()
    }

    /**
     * 点赞操作
     */
    updatePrise(pic_id, pic_url) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ModifyPraise,
                method: 'POST',
                data: {
                    activity_id: app.globalData.roomInfo.room_no,
                    mobile_no: app.globalData.userInfo.mobileNo,
                    pic_id,
                    pic_url,
                    praise_count: 1,
                    value: 1
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 获得图片信息
     */
    getImageInfo(picId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetImageInfo,
                method: 'GET',
                data: {
                    picId,
                    activityId: app.globalData.roomInfo.room_no,
                    pageNo: 1,
                    pageSize: 10,
                    type: 1,
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                if (!res.result.imageDetail){
                    //如果没有用户信息，则返回默认用户
                    if (JSON.stringify(app.globalData.defaultUserInfo) == '{}'){
                        this.request({
                            url: this.apiSettings.GetUserPhoneByUnionId,
                            method: 'POST',
                            data: {
                                openid: 'oYnHqs11e9b23f-00163e0016ec'
                            }
                        }).then(result => {
                            result.result.createTime = ""
                            app.globalData.defaultUserInfo = result
                            res.result.imageDetail = result
                            resolve(res.result)
                        })  
                    } else {
                        res.result.imageDetail = app.globalData.defaultUserInfo
                        resolve(res.result)
                    }
                }else{
                    resolve(res.result)
                }
            })
        })
    }

    /**
     * 提交评论
     */
    saveCommnet(topicId, content, replyTo, masterUnionId, type=1){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveComment,
                method: 'POST',
                data: {
                    type,
                    topicId,
                    content,
                    replyTo,
                    masterUnionId,
                    nickName: app.globalData.userInfo.nickName,
                    unionId: app.globalData.unionid,
                    activityId: type == 1 ? app.globalData.roomInfo.room_no : ''
                }
            }).then(res => {
                resolve(res)
            })
        })       
    }

    /**
     * 获取评论
     */
    getComment(topicId, pageNo, type = 1, pageSize = 10){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetComment,
                data: {
                    type,
                    topicId,
                    pageNo,
                    pageSize,
                    activityId: type == 1 ? app.globalData.roomInfo.room_no : ''
                }
            }).then(res => {
                res.pic_id = topicId
                resolve(res)
            })
        })    
    }

    /**
     * 根据图片地址获取人脸信息
     */
    getFaceInfo(pic_id){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.Getfaceid,
                data: {
                    picId: pic_id,
                    activityId: app.globalData.roomInfo.room_no
                }
            }).then(res => {
                res.pic_id = pic_id
                resolve(res)
            })
        })   
    }
    /**
     * 检查是否收藏
     */
    // isCollection(picId, picUrl){
    //     return new Promise((resolve, reject) => {
    //         this.request({
    //             url: this.apiSettings.IsCollection,
    //             method: 'POST',
    //             data: {
    //                 unionId: app.globalData.unionid,
    //                 picId,
    //                 picUrl,
    //                 activityId: app.globalData.roomInfo.room_no
    //             }
    //         }).then(res => {
    //             resolve(res)
    //         })
    //     })  
    // }

    /**
     * 收藏
     */
    saveCollection(picId, picUrl){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveCollection,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    picId,
                    picUrl,
                    activityId: app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res)
            })
        })      
    }
    /**
     * 取消收藏
     */
    cancleCollection(picId, picUrl){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.CancleCollection,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    picId,
                    picUrl,
                    activityId: app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res)
            })
        })      
    }

    /**
     * 关注某人
     */
    addFollow(followUnionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.AddFollows,
                method: 'GET',
                data: {
                    selfUnionId: app.globalData.unionid,
                    followUnionId
                }
            }).then(res => {
                resolve(res)
            })
        })        
    }

    /**
     * 取消关注
     */
    cancleFollow(followUnionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.CancleFollow,
                method: 'GET',
                data: {
                    selfUnionId: app.globalData.unionid,
                    followUnionId
                }
            }).then(res => {
                resolve(res)
            })
        })    
    }

    /**
     * 检查是否关注
     */
    isFollow(followUnionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.JudgeFollow,
                method: 'GET',
                data: {
                    selfUnionId: app.globalData.unionid,
                    followUnionId
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 删除图片
     */
    deletePhoto(file_name){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.DeleteCPhotos,
                method: 'POST',
                data: {
                    access_token: app.globalData.uploadParam.access_token,
                    job_id: app.globalData.uploadParam.job_id,
                    file_name
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 内部删除图片信息
     */
    deleteImageInfo(picId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.DeleteImageDetail,
                method: 'POST',
                data: {
                    picId
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 获取快捷评论的词条
     */
    getEntry(){
        return new Promise((resolve, reject) => {
            resolve(['抢个沙发', '我觉得很ok', '哎哟~不错哟', '疯狂打call', '生活不止眼前的苟且', '这也太厉害了', '高手啊', '大神求带', '整条GAI最靓的崽', '你最美，比心', '是小仙女本仙吗', '糟了，是心动的感觉', '近朱者赤，近你者甜', '讨人喜欢，百看不厌'])
        })
    }
    /**
     * 获取门店信息
     */
    getStoreInfo(jobId) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getStoreInfo,
                method: 'GET',
                data: {
                    jobId: jobId
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
}

export { Detail }
