var app = getApp()

import { InvitationModel } from './invitation-model'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        curIndex: 0,
        list: [],
        records:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        const list = await InvitationModel.getInvitations()
        this.setData({
            list
        })
        const records = await InvitationModel.getRecords()
        this.setData({
            records
        })
    },

    changeMenu(e){
        this.setData({
            curIndex: e.currentTarget.dataset.index
        })
    },

    toPreview(e){
        wx.navigateTo({
            url: `./h5/h5?templateId=${e.currentTarget.dataset.id}&isPreview=${e.currentTarget.dataset.preview}`,
        })
    }
})