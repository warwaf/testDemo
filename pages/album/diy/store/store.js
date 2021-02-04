import { Diy } from '../diy-model'
var diyModel = new Diy()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeInfo: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        diyModel.getStore().then(res => {
            console.info(res)
            for (let index = res.length - 1; index >= 0; index--) {
                if(res[index].addressInfo.indexOf(options.city) == -1){
                    res.splice(index, 1)
                }
            }
            this.setData({
                storeInfo: res
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    call(e) {
        wx.makePhoneCall({
            phoneNumber: this.data.storeInfo[e.currentTarget.dataset.index].phone
        })
    },

    select(e) {
        app.globalData.addressSelectIndex = e.currentTarget.dataset.index + 1
        wx.navigateBack({
            delta: 1
        });
    }
})