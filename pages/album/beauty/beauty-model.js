import { Base } from '../../../utils/base.js'

var app = getApp()

class Beauty extends Base{

    constructor() {
        super()
    }

    get PicType(){
        return {
            Beauty: 2,
            Normal: 1
        }
    }
    
    getScene(){
        return new Promise((resolve,reject) => {
            this.request({
                url: '/wfa/diy/getScene',
                method: 'POST'
            }).then( res => {
                resolve(res);
            }).catch( err => {
                reject(err);
            })
        })  
    }

    /**
     * 查询预约信息
     */
    searchReservate(){
        return new Promise((resolve, reject) => {
            this.request({
                url:'https://saasmfg.xm520.com/web/api/getReservateDate',
                method: 'POST',
                header: { 'Content-Type': 'application/json'},
                data:{
                    orderNo:app.globalData.activityInfo.orderNo,
                }
            }).then( res => {
                resolve(res);
            }).catch(err=>{
                reject(err);
            })
        })
    }

    /**
     * 创建预约信息
     * @param {*} date 
     */
    createReservate(date){
        return new Promise((resolve, reject) => {
            this.request({
                url: 'https://saasmfg.xm520.com/web/api/Reservate',
                method: 'POST',
                header: { 'Content-Type': 'application/json'},
                data:{
                    orderNo:app.globalData.activityInfo.orderNo,
                    reservationsDate:date,
                    reservationsName:app.globalData.userInfo.nickName
                }
            }).then(res => {
                resolve(res);
            }).catch(err=>{
                reject(err)
            })
        })
    }

    /**
     * 获取看美照列表
     */
    getBeautyList(room_no){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetListByphomeNo,
                data: {
                    image_type: 5,
                    // activityId: 'hc-f-290714'
                    activityId: room_no ? room_no : app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 获取评分列表
     */
    getOrderList(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetOrderList,
                method: 'POST',
                data: {
                    phomeNo: '13922514919'
                }
            }).then(res => {
                // console.log(res)
                resolve(res)
            })
        })
    }

    /**
     * 保存评论
     */
    saveEvaluate(data){
        return new Promise((resolve, reject) => {
            console.log(data)
            this.request({
                url: this.apiSettings.SaveEvaluate,
                method: 'POST',
                data: {
                    ...data
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 获取全部参与点赞人信息
     */
    getFilterAvatars(room_no){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetParticipant,
                method: 'GET',
                data: {
                    activityId: room_no ? room_no : app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    getImagesViaUnionId(unionIds, type, scenes, pick){
        const data = {
            activityId: app.globalData.roomInfo.room_no,
            unionIds,
            scenes,
            type,
        }
        if(pick != 0){
            data.pickState =  pick == 1 ?  true : false
        }
        return new Promise((resolve, reject) => {
            this.request({
                header: { 'Content-Type': 'application/json'},
                url: this.apiSettings.GetImagesViaUnionId,
                method: 'POST',
                data
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 根据图片ID 获取点赞列表
     */
    getPraise(picId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPraise,
                data: {
                    pic_id: picId
                }
            }).then(res => {
                resolve(res)
            })
        })
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
     * 获取吐槽
     * @param {图片ID} picId 
     * @param {0原图 1精修} type 
     */
    getComment(picId, type){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetBeautyComment,
                method: 'GET',
                data: {
                    picId,
                    type
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 获取默认吐槽
     * @param {0原图 1精修} type 
     */
    getDefaultTags(type){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetBeautyTags,
                method: 'GET'
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 保存吐槽
     * @param {图片ID} picId 
     * @param {精修/原图} type 
     * @param {类容} content 
     */
    saveComment(content){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SaveBeautyComment,
                header: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data: content
            }).then(res => {
                resolve(res.result)
            })
        })
    }
    /**
     * 选片
     */
    pickProduct(taskId, fileId, action){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.pickBeautyProduct,
                header: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data: {
                    taskId,
                    fileId,
                    action,
                    activityId: app.globalData.activityInfo.activityId,
                    mobile: app.globalData.userInfo.mobileNo
                }
            }).then(res => {
                if(res.code == 500){
                    reject()
                    return
                }
                resolve(res.result)
            })
        }) 
    }
}

export { Beauty }