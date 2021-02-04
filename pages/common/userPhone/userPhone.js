// pages/userPhone/userPhone.js
import { isJSON } from '../../../utils/util.js'
import apiSettings from '../../../utils/ApiSetting.js'
import { Checkin } from '../../album/checkin/checkin-model.js'

const checkinModel = new Checkin()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //标志--从获取手机号页面返回
        app.globalData.fromAuthorize = true
    },

    getPhoneNumber: function(e){
        checkinModel.getUnionid().then(() => {
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
                                    if (userinfo.data.result) {
                                        app.globalData.userInfo = userinfo.data.result
                                    } 
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    }
})