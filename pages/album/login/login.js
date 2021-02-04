import { Home } from '../home/home-model.js'

const homeModel = new Home()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        anonymous: false,
        unregistered: false,
        orderNo: '',
        isDiff: false,
        phone: '',
        phoneStat: false,
        numList: [],
        disableInput: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // if(!options.order_no){
        //     return wx.showToast({ title: '缺少订单号', icon: 'none' })
        // }
        // this.data.orderNo = options.order_no

        try {
            await homeModel.getUnionid()
            await homeModel.getUserPhoneByUnionId()
        } catch (error) {
            return this.setData({ anonymous:true })
        }

        if(app.globalData.userInfo.mobileNo){
            return this.checkUserPhone(app.globalData.userInfo.mobileNo)
        }
        this.setData({ unregistered:true })
    },

    userInfoEvent(){
        this.setData({ unregistered:true, anonymous: false })
    },

    userPhoneEvent(){
        this.checkUserPhone(app.globalData.userInfo.mobileNo)
    },

    async checkUserPhone(mobileNo){
        var res = await homeModel.checkUserPhoneByOrderNo1(mobileNo, app.globalData.unionid)
        if(res.code == 500){
            this.setData({
                unregistered: false, 
                isDiff: true,
                numList: [],
                disableInput: false,
                phoneStat: false
            })
        }else{
            app.globalData.fromLogin = true
            return wx.switchTab({
                url: '/pages/album/checkin/checkin'
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
            this.checkUserPhone(this.data.phone)
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

    modify(){
        this.setData({
            phoneStat: 1
        })
    },

    stop(){
        return
    }
})