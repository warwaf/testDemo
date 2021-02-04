import { Home } from '../../../pages/album/home/home-model'
import apiSettings from '../../../utils/ApiSetting'
var homeModel = new Home()
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    /**
     * 组件的初始数据
     */
    data: {

    },
    ready(){

    },
    /**
     * 组件的方法列表
     */
    methods: {
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
                                        this.triggerEvent('confirmEvent', {})
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    }
})