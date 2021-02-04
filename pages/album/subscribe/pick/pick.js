import regeneratorRuntime from '../../../../utils/runtime';
import { Subscribe } from '../subscribe-model';
var subscribe = new Subscribe()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityInfo: {},
        photographers: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {

        app.globalData.userInfo = {
            unionId: 'oYnHqs7VWkD6f-b_h_pvO7X0EiJ0'
        }
        app.globalData.activityInfo = {
            activityId: 'hc-f-584519'
        }

        var activityInfo = await subscribe.getAdvancePhotos({ mobile_no: '13512345678' })
        var photographers = await subscribe.getPhotographerList({ province: activityInfo.province, city:activityInfo.city })
        console.log(photographers);
        
        this.setData({
            activityInfo,
            photographers: photographers.data
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})