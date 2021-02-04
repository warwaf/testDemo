// pages/album/subscribe/present/present.js
import regeneratorRuntime from '../../../../utils/runtime';
import { Subscribe } from '../subscribe-model';
var subscribe = new Subscribe()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // phone: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // const res = await subscribe.getAdvancePhotosCount();
        // if (res.data) {
        //     this.setData({
        //         phone: res.data.mobileNo
        //     })
        // }
    },

    jump() {
        // if (this.data.phone) {
        //     wx.redirectTo({
        //         url: `/pages/album/subscribe/result/result?mobile_no=` + this.data.phone,
        //     })
        // } else {
           
        // }
        wx.redirectTo({
            url: `/pages/album/subscribe/index`,
        })
    }
})