import { Home } from '../home/home-model'
import apiSettings from '../../../utils/ApiSetting'

var homeModel = new Home()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showProtocol: false,
        agree: false,
        isRegistered: false,
        phoneStat: false,
        numList: [],
        disableInput: false,
        isMaster: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.activityId = options.room_no
        this.setData({
            isRegistered: Boolean(app.globalData.userInfo.mobileNo)
        })
    },

    agreeEvent(e){
        this.setData({
            agree: e.detail,
            showProtocol: false
        })
    },

    showProtocol(){
        this.setData({
            showProtocol: true
        })
    },

    checkUserPhone(){
        if(!this.data.agree) return
        this._jump(app.globalData.userInfo.mobileNo)
    },

    modify(){
        this.setData({
            phoneStat: 1
        })
    },

    async _jump(userPhone){
        var res = await homeModel.checkUserPhone(userPhone)
        if(res.result){
            wx.redirectTo({
                url: `../home/home?room_no=${this.data.activityId}`
            })
        }else{
            wx.showToast({
                title: '当前手机号与预留授权手机号不一致，请重新输入',
                icon: 'none'
            })
            this.setData({
                inputVal: '',
                isMaster: false
            })
        }
    },

    getPhoneNumber: function(e){
        homeModel.getUnionid().then(() => {
            wx.request({
                url: apiSettings.Host + apiSettings.GetUserPhone,
                method: 'POST',
                data: {
                    encryptedDataStr: e.detail.encryptedData,
                    ivStr: e.detail.iv,
                    keyBytesStr: app.globalData.session_key
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: res => {
                    if (res.data.code !== 200 || !res.data.result.phoneNumber){
                        wx.showToast({
                            title: '获取手机号失败，请重试',
                            icon: 'none'
                        })
                        return
                    }
                    app.globalData.userInfo.mobileNo = res.data.result.phoneNumber
                    wx.request({
                        url: apiSettings.Updatauser,
                        data: {
                            unionId: app.globalData.unionid,
                            mobileNo: res.data.result.phoneNumber
                        },
                        header: {
                            "Content-Type": "application/json",
                            accessToken: app.globalData.mtq_token
                        },
                        method: 'POST',
                        success: data => {
                            wx.request({
                                url: apiSettings.Host + apiSettings.GetUserPhoneByUnionId,
                                method: 'POST',
                                header: { "Content-Type": "application/x-www-form-urlencoded" },
                                data: {
                                    openid: app.globalData.unionid
                                },
                                success: userinfo => {
                                    if (userinfo.result) {
                                        app.globalData.userInfo = userinfo.result
                                    } 
                                    this._jump(app.globalData.userInfo.mobileNo)
                                }
                            })
                        }
                    })
                }
            })
        })
    },

    /**
     * 编辑手机
     */
    editPhone(){
        var phoneStat
        if (this.data.phoneStat === false){
            phoneStat = this.data.userInfo.phone ? 1 : 4
        }else{
            phoneStat = false
        }
        
        this.setData({
            phoneStat,
            phone: this.data.userInfo.phone
        })
    },
    /**
     * 绑定手机：获取验证码
     */
    getVerifyCode(e){
        if(this.data.alreadySend){
            wx.showToast({
                title: '60秒内只能获取一次验证码',
                icon: 'none'
            })
            return
        }
        if (!(/^1[3|4|5|7|8][0-9]\d{8,11}$/.test(this.data.phone))){
            wx.showToast({
                title: '手机号格式不正确,请重新输入',
                icon: 'none'
            })
            return
        }

        homeModel.sendMessage(this.data.phone).then(res => {
            if(res.code == 0){
                this.setData({
                    phoneStat: 2,
                    partPhone: String.prototype.substr.call(this.data.phone, 0, 3) + '***' + String.prototype.substr.call(this.data.phone, 7),
                    numList: [],
                    alreadySend: true
                })
            }
            setTimeout(() => {
                this.setData({
                    alreadySend: false
                })
            }, 60000)
        })
    },

    bindPhoneInput(e){
        this.data.phone = e.detail.value
    },
    /**
     * 绑定手机：下一步
     */
    bindPhone(){
        this.setData({
            disableInput: true
        })
        var code = this.data.numList.join('')
        if (code == wx.getStorageSync('verifyCode')){
            this._jump(this.data.phone)
            this.setData({
                phoneStat: 3,
                "userInfo.mobileNo": this.data.phone
            })
        }else{
            wx.showToast({
                title: '验证码错误，请重新输入',
                icon: 'none'
            })
            this.setData({
                numList: [],
                disableInput: false
            })
        }
    },

    bindCodeInput(e) {
        this.setData({
            numList: e.detail.value.split('')
        })
    },
    /**
     * 绑定手机：更换手机号
     */
    changePhone(){
        this.setData({
            phoneStat: 1
        })
    },
})