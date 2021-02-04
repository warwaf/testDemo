// import regeneratorRuntime from '../../../utils/runtime.js';

/**
 * 相册 - 毕业季、相册 - 配置 用到此页面
 * 
 */

import { Home } from '../../album/home/home-model';
var app = getApp()
var homeModel = new Home();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        path: '',
        activity_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        await homeModel.getUnionid();
        await homeModel.getUserPhoneByUnionId();
        
        // 设置 分享的手机号
        if (options.sharePhone) {
            app.globalData.sharePhone = options.sharePhone;
        }
        
        if(!app.globalData.userInfo.mobileNo){
            wx.navigateTo({
                url: '/pages/common/userPhone/userPhone'
            })
        }
        
        var activityInfo = await homeModel.getActivityInfo(options.activity_id);
        app.globalData.activityInfo = activityInfo;
        
        const activity = activityInfo.deployRoom[0].voucherId;
        const memberId = app.globalData.userInfo.memberId;
        const returnUrl = encodeURIComponent('/pages/album/home/home?room_no=' + options.activity_id);
        const mobile = app.globalData.userInfo.mobileNo;
        const urlTemp = app.globalData.activityH5Url ? app.globalData.activityH5Url : 'https://m.xm520.com/activity/graduation/index.html'
        // var url = `https://m.xm520.com/activity/graduation/index.html?mobile=${mobile}&activity_id=${activity}&event_id=${options.activity_id}&customer_no=${memberId}&returnUrl=${returnUrl}&time=${new Date().getTime()}`
        var url = `${urlTemp}?mobile=${mobile}&activity_id=${activity}&event_id=${options.activity_id}&customer_no=${memberId}&returnUrl=${returnUrl}&time=${new Date().getTime()}`
        
        this.setData({
            path: url,
            activity_id: options.activity_id
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(e) {
        const sharePhone = app.globalData.userInfo.mobileNo;
        return {
            title: '我们的毕业季',
            path: `/pages/webview/beauty/beauty?activity_id=${this.data.activity_id}&sharePhone=${sharePhone}`,
            imageUrl: 'https://hcmtq.oss-accelerate.aliyuncs.com/linshi/huodong.png'
        }
    }
})