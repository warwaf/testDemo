// pages/album/subscribe/result/result.js
import regeneratorRuntime from '../../../../utils/runtime';
import { Subscribe } from '../subscribe-model';
var subscribe = new Subscribe()
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        time: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        wx.showLoading({
            title: '数据加载中...',
        })
        const res = await subscribe.getAdvancePhotosCount();
        wx.hideLoading()
        const start = res.data.startTime.split(' ');
        const end = res.data.endTime.split(' ');
        const time = start[0] + ' ' + start[1].replace('00:00', '00') + '-' + end[1].replace('00:00', '00')
        this.setData({ info: res.data, time })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
    },
    jump() {
        wx.navigateBack({
            delta: 1,
        })
    }
})