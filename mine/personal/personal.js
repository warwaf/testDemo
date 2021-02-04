import { getAstro } from '../../utils/util.js'
import { Personal } from './personal-model.js'
import {
    Home
} from '../../pages/album/home/home-model.js'
var homeModel = new Home()
var personalModel = new Personal()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            avatarUrl: '',
            nickName: '',
            signature: '',
            gender: 1,
            remarks2: '',
            mobileNo: '',
            autograph: ''
        },
        nicknameStat: false,
        genderStat: false,
        signatureStat: false,
        phoneStat: false,
        numList: [],
        disableInput: false,
        alreadySend: false,
        commentError: false
    },
    onLoad: function (options) {
        console.log(options, 'options')
        // let params = JSON.parse(options.userInfo)
        // this.setData({
        //     userInfo: params
        // })
        homeModel.getUserPhoneByUnionId(true).then(res => {
            console.log(res, 'res>>>')
            if (res.code==200) {
                this.setData({
                    userInfo: res.result
                })
            }
            // this.setData({
            //     userInfo: app.globalData.userInfo,
            // })
        })   
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        // console.log(app.globalData, 'app.globalData.userInfo')
        // this.setData({
        //     userInfo: app.globalData.userInfo
        // })
    },

    changeAvatar(){
        wx.navigateTo({
            url: './avatar/avatar',
        })
    },

    /**
     * 编辑昵称
     */
    editNickname(){
        this.setData({
            nicknameStat: !this.data.nicknameStat,
            nickName: this.data.userInfo.nickName
        })
    },

    bindNickNameInput(e) {
        this.data.nickName = e.detail.value
    },

    saveNickName(){
        if (this.data.nickName.length == 0 || this.data.nickName.length > 10){
            wx.showToast({
                title: '昵称长度不得为空或者大于10个字符',
                icon: 'none'
            })
            return
        }
        personalModel.verifyContent(this.data.nickName).then(res => {
            if (res) {
                personalModel.updateUserInfo({ nickName: this.data.nickName }).then(res => {
                    this.setData({
                        nicknameStat: false
                    })
                    if (res.code == 200) {
                        this.setData({
                            "userInfo.nickName": this.data.nickName
                        })
                        app.globalData.userInfo.nickName = this.data.nickName
                        wx.showToast({
                            title: '修改成功',
                            icon: 'none'
                        })
                    }
                })
            } else {
                this.setData({
                    commentError: true
                })
            }
        })
    },

    /**
     * 编辑星座
     */
    editConstellation() {
        this.setData({
            constellationStat: !this.data.constellationStat
        })
    },

    bindDateChange(e){
        var date = e.detail.value.split('-')
        var constellation = getAstro(date[1],date[2]) + '座'
        this.setData({
            "userInfo.remarks2": constellation,
            "userInfo.specificDate": e.detail.value,
        })
        personalModel.updateUserInfo({
            remarks2: constellation,
            specificDate: e.detail.value
        }).then(res => {
            if (res.code == 200) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'none'
                })
            }
        })
    },

    /**
     * 编辑性别
     */
    editGender(){
        this.setData({
            genderStat: !this.data.genderStat
        })
    },

    saveGender(e){
        var gender = e.currentTarget.dataset.gender
        this.setData({
            "userInfo.gender": gender,
            genderStat: false
        })
        personalModel.updateUserInfo({ gender: gender }).then(res => {
            if (res.code == 200) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'none'
                })
            }
        })
    },

    /**
     * 编辑签名
     */
    editSignature(){
        this.setData({
            signatureStat: !this.data.signatureStat,
            signature: this.data.userInfo.autograph
        })
    },

    bindSignatureInput(e){
        if(e.detail.value.length < 150){
            this.setData({
                signature: e.detail.value
            })
        }
    },

    saveSignature(){
        if (this.data.signature.length > 30){
            wx.showToast({
                title: '签名不能超过30个字',
                icon: 'none'
            })
            return
        }
        if (this.data.signature.length > 0){
            personalModel.verifyContent(this.data.signature).then(res => {
                if (res) {
                    wx.showLoading({
                        title: '上传中...'
                    })
                    personalModel.updateUserInfo({ autograph: this.data.signature }).then(result => {
                        wx.hideLoading()
                        this.setData({
                            signatureStat: false
                        })
                        if (result.code == 200) {
                            this.setData({
                                "userInfo.autograph": this.data.signature
                            })
                            app.globalData.userInfo.autograph = this.data.signature
                            wx.showToast({
                                title: '修改成功',
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    this.setData({
                        commentError: true
                    })
                }
            })
        }else{
            wx.showLoading({
                title: '上传中...'
            })
            personalModel.updateUserInfo({ autograph: this.data.signature }).then(res => {
                wx.hideLoading()
                this.setData({
                    signatureStat: false
                })
                if (res.code == 200) {
                    this.setData({
                        "userInfo.autograph": this.data.signature
                    })
                    wx.showToast({
                        title: '修改成功',
                        icon: 'none'
                    })
                }
            })
        }
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
        if (!(/^1[0-9][0-9]\d{8,11}$/.test(this.data.phone))){
            wx.showToast({
                title: '手机号格式不正确,请重新输入',
                icon: 'none'
            })
            return
        }

        personalModel.sendMessage(this.data.phone).then(res => {
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
            personalModel.updateUserInfo({
                mobileNo: this.data.phone
            }).then(res => {
                this.setData({
                    phoneStat: 3,
                    "userInfo.mobileNo": this.data.phone
                })
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

    stop(e){
        return
    },
    /**
    * 返回
    */
    goback(e) {
        if (e.detail == 'goto') {
            wx.switchTab({
                url: '/pages/mine/home/mine',
            })
        }
    },

    cancle(){
        this.setData({
            commentError: false
        })
    }
})