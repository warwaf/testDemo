import { Home } from '../../../pages/album/home/home-model'
var homeModel = new Home()
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        text1: {
            type: String,
            default: ''
        },
        text2: {
            type: String,
            default: ''
        },
        text3: {
            type: String,
            default: ''
        },
        icon: {
            type: Number,
            default: 1
        }
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
        onGotUserInfo: function (e) {
            app.globalData.userInfo = e.detail.userInfo
            app.globalData.options.customer_name = e.detail.userInfo.nickName
    
            homeModel.getUnionid().then(() => {
                wx.request({
                    url: homeModel.apiSettings.Updatauser,
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
                    method: 'POST',
                    success: () => {
                        console.log('保存用户数据成功');
                        
                        this.triggerEvent('confirmEvent', {})
                    }
                })
            })
        }
    }
})