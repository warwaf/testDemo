import apiSettings from './ApiSetting.js'

var app = getApp()

class Base {
    /**
     * 构造函数
     */
    constructor() {
        this.baseUrl = apiSettings.Host
        this.apiSettings = apiSettings
    }

    /**
     * 自定义请求方法
     */
    request(param) {
        const that = this;
        return new Promise((resolve, reject) => {
            if (param.url.startsWith('https') || param.url.startsWith('http')) {
                var url = param.url
            } else {
                var url = this.baseUrl + param.url
            }
            let header = param.header ? param.header : { "Content-Type": "application/x-www-form-urlencoded" };
            header = Object.assign(header,{
                accessToken: app.globalData.mtq_token
            })
            wx.request({
                url,
                data: param.data,
                dataType: "json",
                header,
                method: param.method ? param.method : 'GET',
                success: function(res) {
                    if(res.data.code == 900){
                        console.log("登录失败：");
                        that.getUnionid();
                    }
                    resolve(res.data)
                },
                fail: function(res) {
                    reject(res)
                }
            })
        })
    }

    /**
     * 根据unionId从后台获取用户信息
     */
    getUserPhoneByUnionId(force = false) {
        return new Promise((resolve, reject) => {
            if (JSON.stringify(app.globalData.userInfo) !== '{}' && app.globalData.userInfo && !force) {
                resolve(app.globalData.userInfo)
            }
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
                resolve(res)
            })
        })
    }

    /**
     * 获取用户unionId
     */
    getUnionid(type) {
        return new Promise((resolve, reject) => {
            if (app.globalData.unionid) {
                resolve(app.globalData)
                return
            }
            wx.login({
                success: res => {
                    app.globalData.code = res.code
                    this.request({
                        url: this.apiSettings.GetSessionKey,
                        data: {
                            code: res.code
                        }
                    }).then(data => {
                        app.globalData.session_key = data.result ? data.result.session_key : ""
                        app.globalData.openid = data.result.openid
                        app.globalData.mtq_token = data.result.accessToken;
                        if (data.result.unionid && data.result.unionid !== undefined) {
                            app.globalData.unionid = data.result.unionid
                            resolve(data.result)
                        } else {
                            // console.log('解决部分用户无法获取 unionId');
                            //解决部分用户无法获取 unionId
                            wx.getUserInfo({
                                withCredentials: true,
                                success: result => {
                                    this.request({
                                        url: this.apiSettings.GetUserPhone,
                                        data: {
                                            encryptedDataStr: result.encryptedData,
                                            ivStr: result.iv,
                                            keyBytesStr: data.result.session_key
                                        },
                                        method: 'POST'
                                    }).then(res => {
                                        // console.log('解码获取 unionId');
                                        if (res.code == 200) {
                                            // console.log(res.result.unionId)
                                            app.globalData.unionid = res.result.unionId
                                        }
                                        resolve(res)
                                    })
                                },
                                fail: error => {
                                    console.log('获取用户信息失败');
                                    resolve(false)
                                    reject(error)
                                    // wx.navigateTo({
                                    //     url: '/pages/common/userinfo/userinfo',
                                    // })
                                }
                            })
                        }
                    })
                },
                fail: err => {
                    wx.showToast({
                        title: err.errMsg,
                        icon: 'none'
                    })
                }
            })
        })
    }

    /**
     * 获取服务器令牌
     */
    getAccessToken(room) {
        return new Promise((resolve, reject) => {
            // if (room == undefined && JSON.stringify(app.globalData.uploadParam) !== '{}') {
            //     resolve(app.globalData.uploadParam)
            //     return
            // }
            this.request({
                url: this.apiSettings.GetCAccessToken,
                method: 'POST',
                data: {
                    access_key: 'YhBuiK7F4l0ecS40',
                    store_id: 'C1508',
                    branch_id: 'D8990',
                    customer_name: '檬太奇',
                    customer_phone: app.globalData.userInfo.mobileNo ? app.globalData.userInfo.mobileNo : '13725372605',
                    scene_name: '时尚街拍',
                    product_sku: '1004576',
                    if_correct: '1',
                    channel_id: 'Beautify',
                    job_id: room ? room : app.globalData.roomInfo.room_no,
                }
            }).then(res => {
                if (res.code == 0) {
                    var obj = {
                        access_token: res.data.AccessToken,
                        job_id: res.data.job_id,
                        uploadurl: res.data.UploadUrl.substring(0, res.data.UploadUrl.length - 1)
                    }
                    app.globalData.uploadParam = obj
                    resolve(obj)
                }
            })
        })
    }
        /**
         * 敏感词校验
         */
    verifyContent(content) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ContentVerify,
                method: 'GET',
                data: {
                    content
                }
            }).then(res => {
                resolve(res.code == 200)
            })
        })
    }

    /**
     * 图片校验
     */
    verifyImage(url) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.ImageVerify,
                method: 'GET',
                data: {
                    url
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    /**
     * 通过阿里接口获取图片尺寸
     */
    getImageSize(url) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: url.replace('http://', 'https://') + '?x-oss-process=image/info',
                success: res => {
                    if (res.data !== undefined && res.data.Format) {
                        resolve({
                            width: res.data.ImageWidth.value,
                            height: res.data.ImageHeight.value,
                            size: res.data.FileSize.value
                        })
                    } else {
                        reject()
                    }
                }
            })
        })
    }

    addPicHot(picId, increaseScore) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.AddPicHot,
                method: 'POST',
                header: { "content-type": "application/x-www-form-urlencoded" },
                data: {
                    activityId: getApp().globalData.roomInfo.room_no,
                    picId,
                    increaseScore
                }
            }).then(() => {
                resolve()
            })
        })
    }

    addMovementHot(discoverId, movementId, increaseScore) {
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.AddMovementHot,
                method: 'POST',
                header: { "content-type": "application/x-www-form-urlencoded" },
                data: {
                    discoverId,
                    movementId,
                    increaseScore
                }
            }).then(() => {
                resolve()
            })
        })
    }

    /**
     * 收集formId
     */
    collectFormId(formId) {
        if (__wxConfig.envVersion == undefined) return
        return new Promise((resolve, reject) => {
            this.request({
                url: this.apiSettings.collectFormId,
                method: 'POST',
                data: {
                    unionId: app.globalData.unionid,
                    fromId: formId
                }
            })
        })
    }

    /**
     * 获得地址映射表
     */
    getAddressMap() {
        return new Promise((resolve, reject) => {
            this.request({
                url: 'https://hcmtq.oss-accelerate.aliyuncs.com/address.map.json',
            }).then(res => {
                resolve(res.data)
            })
        })
    }

    updateUserInfo(e){
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.options.customer_name = e.detail.userInfo.nickName
        return new Promise((resolve, reject) => {
            this.getUnionid().then(() => {
                this.request({
                    url: this.apiSettings.Updatauser,
                    data: {
                        unionId:  app.globalData.unionid,
                        openId: app.globalData.openid,
                        nickName: app.globalData.userInfo.nickName,
                        avatarUrl: app.globalData.userInfo.avatarUrl,
                        gender:app.globalData.userInfo.gender,
                        country: app.globalData.userInfo.country,
                        province: app.globalData.userInfo.province,
                        city: app.globalData.userInfo.city,
                        language: app.globalData.userInfo.language,
                        remarks1: '小程序',
                        activityId: app.globalData.fromShare ? app.globalData.roomInfo.room_no : ''
                    },
                    header: {
                        "Content-Type": "application/json",
                        accessToken: app.globalData.mtq_token
                    },
                    method: 'POST'
                }).then(() => {
                    resolve()
                })
            })
        })
    }

    /**
     * 发送手机验证码
     */
    sendMessage(phone){
        return new Promise((resolve, reject) => {
            var code = Math.floor(1000 + Math.random() * 9000)
            getApp().globalData.verifyCode = code
            wx.setStorageSync('verifyCode', code)
            console.log("api send code >>", code, wx.getStorageSync("verifyCode"))
            // return
            this.request({
                url: this.apiSettings.SendMessage,
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    user_id: phone,
                    mobile_no: phone,
                    sign_name: "鲜檬",
                    sms_code: "SMS_146800467",
                    sms_param: `{\"name\":\"${code}\"}`
                }
            }).then(res => {
                resolve(res)
            })
        })
    }

    getAppConfig(){
        return new Promise((resolve, reject) => {
            if(app.globalData.appConfig) resolve(app.globalData.appConfig)
            this.request({
                url: 'https://mtqcshi.hucai.com/test/mtq-config.json'
            }).then(res => {
                app.globalData.appConfig = res
                resolve(res)
            })
        })
    }
}

export { Base }