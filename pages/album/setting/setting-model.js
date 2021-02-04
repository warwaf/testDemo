import { Base } from '../../../utils/base.js'

var app = getApp()

class Setting extends Base {

    constructor() {
        super()
    }

    getMembers(pageNum, pageSize){        
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.GetUserByRoom,
                data: {
                    activityId: app.globalData.activityInfo.activityId,
                    pageNum,
                    pageSize
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 最热列表
     */
    getBannerList(activityType) {
        var list = []
        switch (activityType) {
            case '情侣':
                list = [
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(3).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(4).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(5).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(6).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(7).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(8).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(9).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/AQ/1%20(10).png'
                ]
                break;
            case '家人':
                list = [
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/JT/3%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/JT/3%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/JT/3%20(3).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/JT/3%20(4).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/JT/3%20(5).png'
                ]
                break;
            case '朋友':
                list = [
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(3).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(4).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(5).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(6).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(7).png'
                ]
                break;
            case '同事':
                list = [
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(3).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(4).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(5).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(6).png'
                ]
                break;
            default:
                list = [
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TX/9%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TX/9%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TX/9%20(3).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/TS/8%20(3).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/QD/7%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/QD/7%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(1).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(2).png',
                    'https://hcmtq.oss-accelerate.aliyuncs.com/Banner/PY/6%20(3).png'
                ]
        }
        return new Promise((resolve, reject) => {
            resolve(list)
        })
    }

    /**
     * 创建房间
     */
    createActivityRoom(data){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.CreateActivityRoom,
                method: 'POST',
                data
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 更新房间
     */
    updateActivityRoom(data){
        return new Promise((resolve,reject) => {
            this.request({
                url: this.apiSettings.updateActivityInfo,
                method: 'POST',
                data
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 退出相册
     */
    quitAlbum(type, newUnionId){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.QuitAlbum,
                method: 'GET',
                data: {
                    activityId: app.globalData.activityInfo.activityId,
                    unionId: app.globalData.userInfo.unionId,
                    newUnionId: newUnionId ? newUnionId : '',
                    type
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 通过昵称查询成员
     */
    searchMembers(userName){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.SearchMember,
                method: 'GET',
                data: {
                    activityId: app.globalData.activityInfo.activityId,
                    userName
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 踢出成员
     */
    removeMember(unionIds){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.DeleteMember,
                method: 'POST',
                data: {
                    activityId: app.globalData.activityInfo.activityId,
                    unionIds
                }
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    savePosterInfo(data){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.savePosterInfo,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                data
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    /**
     * 保存相册分组
     */
    saveGroup(classification, oldGroupName = false){
        var data = oldGroupName ? { oldGroupName, newGroupName: classification, activityId: app.globalData.roomInfo.room_no } : { classification, activityId: app.globalData.roomInfo.room_no }
        return new Promise((resolve, reject) => {
            this.request({
                url:  oldGroupName ? this.apiSettings.updateGroup : this.apiSettings.saveGroup,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json'
                },
                data
            }).then(res => {
                resolve(res.result)
            })
        })
    }

    getGroup(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getGroup,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json'
                },
                data: {
                    activityId: app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res.result)
            })
        }) 
    }

    delGroup(classification){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.deleteGroup,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json'
                },
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    classification
                }
            }).then(res => {
                resolve(res.result)
            })
        })  
    }

}

export { Setting }