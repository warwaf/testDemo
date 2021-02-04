import { News } from './message-model.js'
import regeneratorRuntime from '../../../utils/runtime';
const news = new News()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: {
            tasks: []
        },
        isLoading: false,
        isEmpty: true,
        activityId: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMessage(options.activityId, options.orderNo);
        this.setData({ activityId: options.activityId });
        this.data.smart = options.smart
        this.setData({
            typeId: options.typeId ? options.typeId : ""
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    async getMessage(activityId, orderNo) {

        this.setData({ isLoading: true })
        const res = await news.listBeautyMessage(activityId, orderNo)
        console.log(res);
        if (res.code == 200) {
            this.setData({
                message: res.result,
                isLoading: false,
                isEmpty: !res.result.hotel && !res.result.tasks && !res.result.traffic
            })
        } else {
            this.setData({
                isLoading: false,
            })
        }
    },

    back() {
        // if (getCurrentPages().length > 1) {
        //     wx.navigateBack({
        //         delta: 1
        //     })
        // } else {
        //     wx.navigateTo({
        //         url: '/pages/album/beauty/home?room_no'+this.data.activityId,
        //     })
        // }
        if(this.data.smart === '1'){
            wx.redirectTo({
                url: `/pages/album/beauty2/beauty2?room_no=${this.data.activityId}`,
            })
        }else{
            if (this.data.typeId == 11 || this.data.typeId == 12) {
                wx.redirectTo({
                    url: `/pages/album/newBeauty/newBeauty?room_no=${this.data.activityId}&typeId=${this.data.typeId}`,
                }) 
            } else {
                wx.redirectTo({
                    url: `/pages/album/beauty/home?room_no=${this.data.activityId}`,
                })
            }
            
        }

    }
})