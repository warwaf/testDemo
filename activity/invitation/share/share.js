import { InvitationModel } from '../invitation-model'

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        webUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await InvitationModel.getUnionid()
        var webUrl = `https://mtqcshi.hucai.com/test/activity/invitation/index.html#/share?template_id=${options.template_id}&union_id=${app.globalData.unionid}`
        console.log(webUrl);
        this.setData({
            webUrl 
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})