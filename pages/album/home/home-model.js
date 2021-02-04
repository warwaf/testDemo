import { Base } from '../../../utils/base.js'
import { btoa } from '../../../utils/util.js'

var app = getApp()

class Home extends Base {

    constructor() {
        super()
    }
    /**
     * 瀑布流加载
     */
    getRoomPhotos(classification, pageNo, pageSize = 10) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPhotos,
                method: 'GET', 
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    pageNo,
                    pageSize,
                    classification,
                    type: 5
                }
            }).then(res => {
                resolve(res)
            })
        })
    }   
    /**
     * 房间信息加载
     */
    getActivityInfo(room_no) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetCouponActivity,
                data: {
                    activityId: room_no ? room_no : app.globalData.roomInfo.room_no
                }
            }).then(res => {
                var activityInfo = res.result[0]
                app.globalData.activityInfo = activityInfo
                resolve(activityInfo)
            }).catch(err=>{
                reject(err)
            })
        })
    }

    /**
     * 查询红包金额
     */
    getRedPacket() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetRedPacket,
                method: 'GET',
                data: {
                    unionId: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 注册
     */
    registered() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.Registered,
                method: 'POST',
                data: {
                    'class_id': app.globalData.roomInfo.room_no,
                    'mobile_no': app.globalData.userInfo.mobileNo,
                    'customer_name': app.globalData.unionid,
                    'wechat_openid': app.globalData.unionid,
                    'type': 2
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 插入历史记录
     */
    addRecord() {
        return new Promise((resolve, reject) => {
            var systemInfo = wx.getSystemInfoSync()
            var param = {
                activityId: app.globalData.roomInfo.room_no,
                mobileNo: app.globalData.userInfo.mobileNo,
                unionId: app.globalData.unionid,
                wechatVersion: systemInfo.version,
                system: systemInfo.system,
                brand: systemInfo.model
            }
            this.request({
                url: this.apiSettings.SaveHistory,
                method: 'POST',
                data: param
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 预约摄影师
     */
    arrangePhotographer() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.RecordCamera,
                method: 'GET',
                data: {
                    unionId: app.globalData.unionid,
                    mobile: app.globalData.unionid
                }
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 获得预约摄影师人数
     */
    getPhotographer() {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetCamera,
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }
    /**
     * 判断房间号是否存在于改用户历史记录中
     */
    judgePermission(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.JudgePermission,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    unionId: app.globalData.unionid
                },
                method: 'GET'
            }).then(res => {
                resolve(res.message == 1)
            })
        })
    }
    /**
     *校验密码
     */
    verifyPassword(password){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.VerifyPassword,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    unionId: app.globalData.userInfo.unionId,
                    password
                },
                method: 'GET'
            }).then(res => {
                resolve(res.result.data == 0)
            })
        })
    }

    /**
     * 领取优惠券
     */
    // getCoupon() {
    //     return new Promise((resolve, reject) => {
    //         this.request({
    //             url: this.apiSettings.GetCoupon,
    //             method: 'POST',
    //             data: {
    //                 activity_id: app.globalData.activityInfo.deployRoom[0].voucherId,
    //                 event_id: '',
    //                 customer_no: app.globalData.userInfo.memberId
    //             }
    //         }).then(res => {
    //             resolve(res)
    //         })
    //     })
    // }
    
     /**
     * 领取优惠券 - 新接口
     */
    getConpon(couponCode) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetConpon,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    couponCode: couponCode || app.globalData.activityInfo.deployRoom[0].voucherId
                }
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 获取时间轴列表
     */
    getPhotosGroupByDate(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPhotosGroupByDate,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                },
                method: 'GET'
            }).then(res => {
                var data = []
                res.result.forEach(item => {
                    data.push({
                        date: Object.keys(item)[0],
                        data: Object.values(item)[0],
                    })
                    
                })
                resolve(data)
            })
        })
    }

    /**
     * 获取指定某一天所有图片
     */
    getPhotosByDate(date, pageNo=1, pageSize=30){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetPhotosByDate,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    dateTime: date,
                    pageNo: pageNo,
                    pageSize: pageSize
                },
                method: 'GET'
            }).then(res => {
                resolve(res.list)
            })
        })
    }
    /**
     * 获取房间配置
     */
    getToolsConfig(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.GetToolsConfig,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    type: app.globalData.activityInfo.type
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 根据房间号 校验手机号与预留手机号一致 
     */
    checkUserPhone(mobileNo){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.checkUserPhone,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    mobileNo,
                    unionId: app.globalData.unionid
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    /**
     * 根据订单号 校验手机号与预留手机号一致 
     */
    checkUserPhoneByOrderNo(mobileNo, orderNo){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.checkUserPhone,
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    mobileNo,
                    unionId: app.globalData.unionid
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    /**
     * 根据订单号 校验手机号与预留手机号一致 智慧相册
     */
    checkUserPhoneByOrderNo1(mobile){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.checkUserPhone1 + `?mobile=${mobile}&unionId=${app.globalData.unionid}`,
                method: 'POST'
            }).then(res => {
                resolve(res)
            })
        }) 
    }

    /**
     * 获取分组信息
     */
    getGroupInfo(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getGroup,
                data: {
                    activityId: app.globalData.roomInfo.room_no
                },
                method: 'GET'
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 查询是否展示订阅
     */
    getSubscribeStatus(amount = 1, remark = ''){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getSubscribeStatus,
                header: {
                    contentType: 'application/json'
                },
                data: {
                    activityId: app.globalData.roomInfo.room_no,
                    amount,
                    remark
                },
                method: 'POST'
            }).then(res => {
                resolve(res)
            })
        })
    }

    getRoomQrCode(){
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getRoomQrCode,
                data: {
                    path: 'pages/album/home/home',
                    scene: `room_no=${app.globalData.roomInfo.room_no}&dId=${app.globalData.globalStoreId}`
                },
                method: 'POST'
            }).then(res => {
                resolve(res.message)
            })
        })
    }

    /**
     * 根据unionId从后台获取用户信息
     */
    getUserInfoByUnionId(force = false) {
        return new Promise((resolve, reject) => {
            // if (JSON.stringify(app.globalData.userInfo) !== '{}' && app.globalData.userInfo && !force) {
            //     resolve(app.globalData.userInfo)
            // }
            this.request({
                url: this.apiSettings.GetUserPhoneByUnionId,
                method: 'POST',
                data: {
                    openid: app.globalData.unionid
                }
            }).then(res => {
                if (res.result) {
                    app.globalData.userInfo = res.result
                    app.globalData.mta.Data.userInfo = {'open_id':res.result.openId, 'phone':res.result.mobileNo};
                } else {
                    // wx.navigateTo({
                    //     url: '/pages/common/userinfo/userinfo'
                    // })
                    reject()
                }
                console.log("get user info res>>", res)
                resolve(res)
            })
        })
    }

    /**
     * 根据ID换取房间号
     */
    getActivityId(room_no) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.getActivityId,
                data: {
                    id: room_no ? room_no : app.globalData.roomInfo.room_no
                }
            }).then(res => {
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }

}

export { Home }